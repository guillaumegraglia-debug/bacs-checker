export async function generateReport(reportData) {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("Clé API OpenAI manquante");
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "Tu es un assistant qui génère un rapport concis sur le décret BACS à partir des données fournies.",
          },
          {
            role: "user",
            content: `Génère un rapport synthétique basé sur les données suivantes:\n${JSON.stringify(
              reportData,
              null,
              2
            )}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim();
  } catch (error) {
    console.error("Erreur lors de la génération du rapport:", error);
    throw error;
  }
}
