using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace banana_shop.backend.Models;

public class SalesOrder
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("items")]
    public required Dictionary<string, ItemModel> Items { get; set; } = [];

    [BsonElement("customerDetails")]
    public required CustomerDetailsModel CustomerDetails { get; set; }

    [BsonElement("status")]
    public int Status { get; set; }

    public class ItemModel
    {
        [BsonIgnoreIfNull]
        public string? Name { get; set; }

        [BsonElement("quantity")]
        public required int Quantity { get; set; }
    }

    public class CustomerDetailsModel
    {
        [BsonElement("name")]
        public required string Name { get; set; }

        [BsonElement("address")]
        public required string Address { get; set; }

        [BsonElement("apartment")]
        public string? Apartment { get; set; }

        [BsonElement("city")]
        public string? City { get; set; }

        [BsonElement("state")]
        public string? State { get; set; }

        [BsonElement("postcode")]
        public int PostCode { get; set; }

        [BsonElement("phone")]
        public required int Phone { get; set; }

        [BsonElement("email")]
        public required string Email { get; set; }
    }
}