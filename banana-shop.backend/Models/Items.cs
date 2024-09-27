using MongoDB.Bson.Serialization.Attributes;

namespace banana_shop.backend.Models;

public class Items
{
    [BsonId]
    public required int Id;

    [BsonElement("name")]
    public required string Name;
}
