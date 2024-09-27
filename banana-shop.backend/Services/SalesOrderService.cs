using System;
using banana_shop.backend.Interfaces;
using banana_shop.backend.Models;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;

namespace banana_shop.backend.Services;

public class SalesOrderService : ISalesOrderService
{
    private readonly IMongoCollection<SalesOrder> salesOrderCollection;

    public SalesOrderService(IOptions<MongoDBSettings> mongoDBSettings)
    {
        MongoClient client = new(mongoDBSettings.Value.ConnectionURI);
        IMongoDatabase database = client.GetDatabase(mongoDBSettings.Value.DatabaseName);
        salesOrderCollection = database.GetCollection<SalesOrder>(mongoDBSettings.Value.CollectionName["sales_order"]);
    }

    public Task<ObjectId> CreateSalesOrderAsync(SalesOrder salesOrder)
    {
        throw new NotImplementedException();
    }

    public Task<ObjectId> DeleteSalesOrderAsync(string id)
    {
        throw new NotImplementedException();
    }

    public Task<SalesOrder> GetSaleOrderAsync(string id)
    {
        throw new NotImplementedException();
    }

    public async Task<List<SalesOrder>> GetSalesOrdersAsync()
    {
        var collection = await salesOrderCollection.Find(new BsonDocument()).ToListAsync();
        Console.WriteLine(collection[0].Items.FirstOrDefault(item => item.Key == "1"));
        return await salesOrderCollection.Find(new BsonDocument()).ToListAsync();
    }

    public Task<ObjectId> UpdateSalesOrderAsync(string id, SalesOrder salesOrder)
    {
        throw new NotImplementedException();
    }
}