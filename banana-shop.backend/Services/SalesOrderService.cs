using banana_shop.backend.Interfaces;
using banana_shop.backend.Models;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;

namespace banana_shop.backend.Services;

public class SalesOrderService : ISalesOrderService
{
    private readonly IItemService itemService;
    private readonly IMongoCollection<SalesOrder> salesOrderCollection;

    public SalesOrderService(IOptions<MongoDBSettings> mongoDBSettings, IItemService itemService)
    {
        MongoClient client = new(mongoDBSettings.Value.ConnectionURI);
        IMongoDatabase database = client.GetDatabase(mongoDBSettings.Value.DatabaseName);
        salesOrderCollection = database.GetCollection<SalesOrder>(mongoDBSettings.Value.CollectionName["sales_order"]);
        this.itemService = itemService;
    }

    public async Task<string> CreateSalesOrderAsync(SalesOrder salesOrder)
    {
        await salesOrderCollection.InsertOneAsync(salesOrder);
        return salesOrder.Id ?? "Error";
    }

    public async Task<SalesOrder> GetSalesOrderAsync(string id)
    {
        if (ObjectId.TryParse(id, out ObjectId objectId))
        {
            var filter = Builders<SalesOrder>.Filter.Eq("_id", objectId);
            var salesOrder = await salesOrderCollection.Find(filter).FirstOrDefaultAsync();
            var items = await itemService.GetItemsAsync();

            if (salesOrder == null)
            {
                throw new KeyNotFoundException($"Sales order {id} does not exist");
            }
            else
            {
                foreach (var item in salesOrder.Items)
                {
                    var nameObj = items.FirstOrDefault(i => i.Id.ToString() == item.Key);
                    item.Value.Name = nameObj != null ? nameObj.Name : "ITEM NAME";
                }
            }

            return salesOrder;
        }
        else
        {
            throw new FormatException("The provided ID is not a valid ObjectId.");
        }
    }

    public async Task<List<SalesOrder>> GetSalesOrdersAsync()
    {
        return await salesOrderCollection.Find(new BsonDocument()).ToListAsync();
    }

    public async Task<string> UpdateSalesOrderAsync(string id, SalesOrder salesOrder)
    {
        if (ObjectId.TryParse(id, out ObjectId objectId))
        {
            var filter = Builders<SalesOrder>.Filter.Eq("_id", objectId);
            var result = await salesOrderCollection.ReplaceOneAsync(filter, salesOrder);

            if (result.MatchedCount == 0)
            {
                throw new InvalidOperationException($"No documents matched the filter in the database. Object ID: {id}");
            }
            else if (result.ModifiedCount == 0)
            {
                throw new InvalidOperationException($"Document replaced failed. Object ID: {id}");
            }
            
            return id;
        }
        else
        {
            throw new FormatException("The provided ID is not a valid ObjectId.");
        }
    }
}