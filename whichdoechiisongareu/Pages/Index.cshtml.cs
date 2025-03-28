using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Newtonsoft.Json;
using System.Net.Http.Headers;

namespace whichdoechiisongareu.Pages;

public class IndexModel : PageModel
{
    private readonly ILogger<IndexModel> _logger;

    public IndexModel(ILogger<IndexModel> logger)
    {
        _logger = logger;
    }

    public void OnGet()
    {
        _logger.LogInformation("🟢 OnGet fired: Page loaded.");
    }

    public class UserData
    {
        public string Name { get; set; }
        public string StarSign { get; set; }
    }


    [IgnoreAntiforgeryToken]
    public async Task<IActionResult> OnPostGenerateVibeAsync([FromBody] UserData data)
    {
        var result = await GenerateVibeCardAsync(data.Name, data.StarSign);
        return new JsonResult(result);
    }

    public async Task<string> GenerateVibeCardAsync(string name, string starSign)
    {
        try
        {
            var apiKey = Environment.GetEnvironmentVariable("GEMINI_API_KEY");

            if (string.IsNullOrEmpty(apiKey))
            {
                return "API key is missing. Please configure it correctly.";
            }
            var url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={apiKey}";

            var requestBody = new
            {
                contents = new[]
                {
                new
                {
                    parts = new[]
                    {
                        new { text = $"My name is {name} and my star sign is {starSign}. Based on my name and star sign, choose the best match for me from this list of Doechii songs:" +
                        $"'Stanka Pooh', 'Bullfrog', 'Boiled Peanuts', 'Denial is a River', 'Catfish', 'Skipp', 'Hide N Seek', 'Bloom', 'Wait', 'Death Roll'," +
                        $"'Profit', 'Boom Bap', 'Nissan Altima', 'GTFO', 'Huh!', 'Slide', 'Fireflies', 'Beverly Hills', 'Alligator Bites Never Heal', 'Anxiety'" +
                        $"and explain why you chose that in one sentence. Make sure that the result is random but makes sense to AVOID SIMILARITIES in results " +
                        $"and very IMPORTANT to avoid using asterisks for the song titles and do not include the NAME of the user in the generated sentence" +
                        $"and then MAKE SURE TO follow this format for the sentence: You are [insert song title] because [insert short explanation in 5 to 8 words that does not include the given name]"

                        }
                    }
                }
            }
            };

            var client = new HttpClient();
            var jsonContent = JsonConvert.SerializeObject(requestBody);
            var content = new StringContent(jsonContent, System.Text.Encoding.UTF8, "application/json");

            var response = await client.PostAsync(url, content);
            var responseJson = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                return "Sorry! I'm out of vibes right now 🌙✨. Try again later.";
            }

            dynamic result = JsonConvert.DeserializeObject(responseJson);
            return result.candidates[0].content.parts[0].text.ToString();
        }
        catch (Exception ex)
        {
            return $"Exception: {ex.Message}";
        }
    }


}