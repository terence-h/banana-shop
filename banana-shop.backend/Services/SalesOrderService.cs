using banana_shop.backend.Interfaces;
using banana_shop.backend.Models;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;

namespace banana_shop.backend.Services;

public class SalesOrderService : ISalesOrderService
{
    private readonly IMongoCollection<SalesOrder> salesOrderCollection;
    private readonly IMongoCollection<Item> itemsCollection;

    public SalesOrderService(IOptions<MongoDBSettings> mongoDBSettings)
    {
        MongoClient client = new(mongoDBSettings.Value.ConnectionURI);
        IMongoDatabase database = client.GetDatabase(mongoDBSettings.Value.DatabaseName);
        salesOrderCollection = database.GetCollection<SalesOrder>(mongoDBSettings.Value.CollectionName["sales_order"]);
        itemsCollection = database.GetCollection<Item>(mongoDBSettings.Value.CollectionName["items"]);
    }

    public Task<ObjectId> CreateSalesOrderAsync(SalesOrder salesOrder)
    {
        throw new NotImplementedException();
    }

    public Task<ObjectId> DeleteSalesOrderAsync(string id)
    {
        throw new NotImplementedException();
    }

    public async Task<SalesOrder> GetSaleOrderAsync(string id)
    {
        if (ObjectId.TryParse(id, out ObjectId objectId))
        {
            var filter = Builders<SalesOrder>.Filter.Eq("_id", objectId);
            var salesOrder = await salesOrderCollection.Find(filter).FirstOrDefaultAsync();
            var items = await itemsCollection.Find(new BsonDocument()).ToListAsync();

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

    public Task<ObjectId> UpdateSalesOrderAsync(string id, SalesOrder salesOrder)
    {
        throw new NotImplementedException();
    }
}