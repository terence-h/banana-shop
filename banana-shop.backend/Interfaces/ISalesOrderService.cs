using banana_shop.backend.Models;
using MongoDB.Bson;

namespace banana_shop.backend.Interfaces;

public interface ISalesOrderService
{
    public Task<List<SalesOrder>> GetSalesOrdersAsync();
    public Task<SalesOrder> GetSalesOrderAsync(string id);
    public Task<string> CreateSalesOrderAsync(SalesOrder salesOrder);
    public Task<ObjectId> UpdateSalesOrderAsync(string id, SalesOrder salesOrder);
}