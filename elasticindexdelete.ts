import { Client } from '@elastic/elasticsearch';

// Configuration
const ELASTICSEARCH_NODE: string = 'http://localhost:9200';
const GLOB_EXPRESSION: string = 'index-prefix-*';

async function deleteIndexes(globExpression: string): Promise<void> {
    try {
        const client = new Client({
            node: ELASTICSEARCH_NODE,
        });

        // Fetch all index names
        const response = await client.cat.indices({ format: 'json' });
        const allIndexes: string[] = response.body.map((index: any) => index.index);

        // Create the regex from the glob expression
        const globToRegex = (glob: string) => new RegExp('^' + glob.split('*').map((part: string) => RegExp.escape(part)).join('.*') + '$');
        const regex: RegExp = globToRegex(globExpression);

        // Filter indexes based on glob expression
        const indexesToDelete: string[] = allIndexes.filter((index: string) => regex.test(index));

        // Delete the indexes
        for (const index of indexesToDelete) {
            await client.indices.delete({ index });
            console.log(`Deleted index: ${index}`);
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

// This function escapes special characters in strings for regex
RegExp.escape = function(s: string) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

// Call the function with the desired glob expression
deleteIndexes(GLOB_EXPRESSION);
