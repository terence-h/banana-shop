using banana_shop.backend.Models;
using MongoDB.Bson;

namespace banana_shop.backend.Interfaces;

public interface ISalesOrderService
{
    public Task<List<SalesOrder>> GetSalesOrdersAsync();
    public Task<SalesOrder> GetSaleOrderAsync(string id);
    public Task<ObjectId> CreateSalesOrderAsync(SalesOrder salesOrder);
    public Task<ObjectId> UpdateSalesOrderAsync(string id, SalesOrder salesOrder);
    public Task<ObjectId> DeleteSalesOrderAsync(string id);
}