public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder();
        var portOverwride = 0;
        var portArg = args.FirstOrDefault(a => a.StartsWith("-port="));
        if (portArg != null && int.TryParse(portArg.Split('=')[1], out var parsedPort))
        {
            portOverwride = parsedPort;
            Console.WriteLine($"Running on custom port: http://localhost:{portOverwride}");
            builder.WebHost.UseUrls($"http://localhost:{parsedPort}");
        }

        var app = builder.Build();
        app.UseDefaultFiles();
        app.UseStaticFiles();

        app.MapGet("/api/hello", () => { return Results.Ok(new { message = "Hello from .NET minimal API" }); });
        app.Run();
    }

}