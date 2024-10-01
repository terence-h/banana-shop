namespace banana_shop.backend.Models;

public class MongoDBSettings
{
    public required string ConnectionURI { get; set; }
    public required string DatabaseName { get; set; }
    public required Dictionary<string, string> CollectionName { get; set; }
}