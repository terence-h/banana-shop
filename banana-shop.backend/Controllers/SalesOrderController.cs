using banana_shop.backend.Interfaces;
using banana_shop.backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace banana_shop.backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class SalesOrderController(ISalesOrderService salesOrderService) : ControllerBase
{
    [HttpGet]
    public async Task<List<SalesOrder>> GetSalesOrdersAsync()
    {
        return await salesOrderService.GetSalesOrdersAsync();
    }

    [HttpGet("{id}")]
    public async Task<SalesOrder> GetSalesOrderAsync(string id)
    {
        return await salesOrderService.GetSalesOrderAsync(id);
    }

    [HttpPost]
    public async Task<string> CreateSalesOrder([FromBody] SalesOrder salesOrder)
    {
        return await salesOrderService.CreateSalesOrderAsync(salesOrder);
    }
}