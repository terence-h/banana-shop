using banana_shop.backend.Models;

namespace banana_shop.backend.Interfaces;

public interface IItemService
{
    public Task<List<Item>> GetItemsAsync();
    public Task<Item> GetItemAsync(int id);
    public Task<int> CreateSalesOrderAsync(Item item);
    public Task<int> UpdateSalesOrderAsync(int id, Item item);
    public Task<int> DeleteSalesOrderAsync(int id);
}