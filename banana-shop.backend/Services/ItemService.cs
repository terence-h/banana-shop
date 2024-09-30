using banana_shop.backend.Interfaces;
using banana_shop.backend.Models;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;

namespace banana_shop.backend.Services;

public class ItemService : IItemService
{
    private readonly IMongoCollection<Item> itemsCollection;

    public ItemService(IOptions<MongoDBSettings> mongoDBSettings)
    {
        MongoClient client = new(mongoDBSettings.Value.ConnectionURI);
        IMongoDatabase database = client.GetDatabase(mongoDBSettings.Value.DatabaseName);
        itemsCollection = database.GetCollection<Item>(mongoDBSettings.Value.CollectionName["items"]);
    }

    public Task<int> CreateItemAsync(Item item)
    {
        throw new NotImplementedException();
    }

    public Task<int> DeleteItemAsync(int id)
    {
        throw new NotImplementedException();
    }

    public async Task<List<Item>> GetItemsAsync()
    {
        return await itemsCollection.Find(new BsonDocument()).ToListAsync();
    }

    public Task<int> UpdateItemAsync(int id, Item item)
    {
        throw new NotImplementedException();
    }
}
