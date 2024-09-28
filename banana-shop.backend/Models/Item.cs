using MongoDB.Bson.Serialization.Attributes;

namespace banana_shop.backend.Models;

public class Item
{
    [BsonId]
    public required int Id;

    [BsonElement("name")]
    public required string Name;

    [BsonElement("price")]
    public required double Price;
}
