using banana_shop.backend.Interfaces;
using banana_shop.backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace banana_shop.backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ItemController(IItemService itemService) : ControllerBase
{
    [HttpGet]
    public async Task<List<Item>> GetItemsAsync()
    {
        return await itemService.GetItemsAsync();
    }
}