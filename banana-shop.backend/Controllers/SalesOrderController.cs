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
}