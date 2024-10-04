using banana_shop.backend.Interfaces;
using banana_shop.backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace banana_shop.backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ContactController(IContactService contactService) : ControllerBase
{
    [HttpGet]
    public async Task<List<ContactForm>> GetContactFormsAsync()
    {
        return await contactService.GetContactFormsAsync();
    }

    [HttpGet("{id}")]
    public async Task<ContactForm> GetContactFormAsync(string id)
    {
        return await contactService.GetContactFormAsync(id);
    }

    [HttpPost]
    public async Task<IActionResult> CreateContactFormAsync([FromBody] ContactForm contactForm)
    {
        string result = await contactService.CreateContactFormAsync(contactForm);
        return result.Length == 0 ? BadRequest() : Ok(result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateContactFormAsync(string id, [FromBody] ContactForm contactForm)
    {
        string result = await contactService.UpdateContactFormAsync(id, contactForm);
        return result.Length == 0 ? BadRequest() : Ok(result);
    }
}