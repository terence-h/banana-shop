using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace banana_shop.backend.Models;

public class ContactForm
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("name")]
    public required string Name { get; set; }

    [BsonElement("email")]
    public required string Email { get; set; }

    [BsonElement("message")]
    public required string Message { get; set; }

    [BsonElement("replied")]
    public bool? Replied { get; set; } = false;
}