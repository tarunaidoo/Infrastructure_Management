
async function createReportIssue(data){
    const endpoint = '/data-api/rest/MAINTENANCE_ISSUE';
    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
    
        if (!response.ok) {
            const errorDetails = await response.text();
            throw new Error(`Failed to send report: ${errorDetails}`);
        }
    
        const result = await response.json();
        console.table(result.value);
    } catch (error) {
        console.error('Error:', error);
    }
}

  export{createReportIssue}
