using banana_shop.backend.Interfaces;
using banana_shop.backend.Models;
using banana_shop.backend.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.Configure<MongoDBSettings>(builder.Configuration.GetSection("MongoDB"));
builder.Services.AddScoped<ISalesOrderService, SalesOrderService>();

builder.Services.AddControllers();

builder.Services.AddRazorPages();  // Razor Pages
builder.Services.AddSwaggerGen();  // Swagger

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "API v1");
    c.RoutePrefix = "swagger";  // Swagger served at /swagger, not the root
});

app.UseAuthorization();

app.MapRazorPages();

app.MapControllers();

app.Run();
