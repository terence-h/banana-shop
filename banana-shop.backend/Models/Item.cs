using MongoDB.Bson.Serialization.Attributes;

namespace banana_shop.backend.Models;

public class Item
{
    [BsonId]
    public required int Id { get; set; }

    [BsonElement("name")]
    public required string Name { get; set; }

    [BsonElement("price")]
    public required double Price { get; set; }

    [BsonElement("maxQuantityPerOrder")]
    public required int MaxQuantityPerOrder { get; set; }
}
