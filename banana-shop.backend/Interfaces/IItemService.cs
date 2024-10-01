using banana_shop.backend.Models;

namespace banana_shop.backend.Interfaces;

public interface IItemService
{
    public Task<List<Item>> GetItemsAsync();
    public Task<int> CreateItemAsync(Item item);
    public Task<int> UpdateItemAsync(int id, Item item);
    public Task<int> DeleteItemAsync(int id);
}