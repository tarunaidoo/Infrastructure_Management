//fetch ISSUES from MAINTENANCE
async function fetchIssues() {
    const endpoint = '/data-api/rest/MAINTENANCE_ISSUE';
    try {
        const response = await fetch(endpoint);
        const data = await response.json();
        // console.log("Issues: ", data);
        
        if (data && data.value) {
            return data.value; // Return the array of issues
        } else {
            console.error('Unexpected API response structure', data);
            return [];
        }
    } catch (error) {
        console.error('Failed to fetch issues', error);
        return [];
    }
}
export {fetchIssues};

//fetch VENUES from VENUE
async function fetchVenues() {
    const endpoint = '/data-api/rest/VENUE';
    try {
        const response = await fetch(endpoint);
        const data = await response.json();
        // console.log("Venues: ", data);
        
        if (data && data.value) {
            return data.value; // Return the array of venues
        } else {
            console.error('Unexpected API response structure', data);
            return [];
        }
    } catch (error) {
        console.error('Failed to fetch venues', error);
        return [];
    }
}
export {fetchVenues};

//resolve issues
async function resolveIssues(issueID, newStatus){
    try {
        const issues = await fetchIssues();
        const issueToUpdate = issues.find(i => i.ISSUE_ID === issueID);

        if(!issueToUpdate){
            throw new Error(`Issue with ID ${issueID} not found!`);
        }

        const updateIssue = {
            TITLE: issueToUpdate.TITLE,
            VENUE_ID: issueToUpdate.VENUE_ID,
            REPORTED_BY: issueToUpdate.REPORTED_BY,
            REPORT_DATE: issueToUpdate.REPORT_DATE,
            DESCRIPTION: issueToUpdate.DESCRIPTION,
            DATE_RESOLVED: new Date().toISOString(),
            ISSUE_STATUS: newStatus,
        };

        const endpoint = `/data-api/rest/MAINTENANCE_ISSUE/ISSUE_ID`;
        const response = await fetch(`${endpoint}/${issueID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateIssue),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Update Error:', errorData);
            throw new Error(`Failed to update status for issue: ${issueID}. Status: ${response.status}, Error: ${JSON.stringify(errorData)}`);
        }

        return await response.json();

    } catch (error) {
        console.error('Failed to resolve issue:', error);
        throw error;
    }
};
export {resolveIssues}

