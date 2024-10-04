using banana_shop.backend.Models;

namespace banana_shop.backend.Interfaces;

public interface IContactService
{
    public Task<List<ContactForm>> GetContactFormsAsync();
    public Task<ContactForm> GetContactFormAsync(string id);
    public Task<string> CreateContactFormAsync(ContactForm contactForm);
    public Task<string> UpdateContactFormAsync(string id, ContactForm contactForm);
}