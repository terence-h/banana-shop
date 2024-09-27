using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace banana_shop.backend.Models;

public class SalesOrder
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public required string Id { get; set; }

    [BsonElement("items")]
    public required Dictionary<string, Item> Items { get; set; } = [];

    [BsonElement("status")]
    public required int Status { get; set; }
}


public class Item
{
    // [BsonElement("id")]
    // public required string Id { get; set; }

    [BsonElement("quantity")]
    public required int Quantity { get; set; }
}