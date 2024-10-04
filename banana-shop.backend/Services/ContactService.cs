using System;
using banana_shop.backend.Interfaces;
using banana_shop.backend.Models;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;

namespace banana_shop.backend.Services;

public class ContactService : IContactService
{
    private readonly IMongoCollection<ContactForm> contactFormsCollection;

    public ContactService(IOptions<MongoDBSettings> mongoDBSettings)
    {
        MongoClient client = new(mongoDBSettings.Value.ConnectionURI);
        IMongoDatabase database = client.GetDatabase(mongoDBSettings.Value.DatabaseName);
        contactFormsCollection = database.GetCollection<ContactForm>(mongoDBSettings.Value.CollectionName["contact_form"]);
    }

    public async Task<string> CreateContactFormAsync(ContactForm contactForm)
    {
        await contactFormsCollection.InsertOneAsync(contactForm);
        return contactForm.Id ?? string.Empty;
    }

    public async Task<ContactForm> GetContactFormAsync(string id)
    {
        if (ObjectId.TryParse(id, out ObjectId objectId))
        {
            var filter = Builders<ContactForm>.Filter.Eq("_id", objectId);
            var contactForm = await contactFormsCollection.Find(filter).FirstOrDefaultAsync() ?? throw new KeyNotFoundException($"Contact form {id} does not exist");
            return contactForm;
        }
        else
        {
            throw new FormatException("The provided ID is not a valid ObjectId.");
        }
    }
    
    public async Task<List<ContactForm>> GetContactFormsAsync()
    {
        return await contactFormsCollection.Find(new BsonDocument()).ToListAsync();
    }

    public async Task<string> UpdateContactFormAsync(string id, ContactForm contactForm)
    {
        if (ObjectId.TryParse(id, out ObjectId objectId))
        {
            var filter = Builders<ContactForm>.Filter.Eq("_id", objectId);
            contactForm.Replied = true;
            var result = await contactFormsCollection.ReplaceOneAsync(filter, contactForm);

            if (result.MatchedCount == 0)
            {
                throw new InvalidOperationException($"No documents matched the filter in the database. Object ID: {id}");
            }
            else if (result.ModifiedCount == 0)
            {
                throw new InvalidOperationException($"Document replaced failed. Object ID: {id}");
            }

            return id;
        }
        else
        {
            throw new FormatException("The provided ID is not a valid ObjectId.");
        }
    }
}