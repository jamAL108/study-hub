import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey: any = process.env.NEXT_PUBLIC_GEMINI;

export const promptGenerate = (topic: any, level: any, background: any) => {
    const prompt = `
        Generate a detailed learning path for ${topic} at ${level} level.
        Background: ${background}

        Please include:
            Prerequisites: An array of objects (each should be a valid Prerequisite based on topic), each containing three attributes:
                type (e.g., "required" or "recommended")
                title (e.g., "Basic programming knowledge")
                Material: a string (docs or youtube) which one is better to learn this topic

            LearningStages: An object describing the stages of the learning process, containing two attributes:
                description (a brief description of the learning path)
                stages: An array of objects explaining different learning stages, where each object includes:
                    name: string (stage name)
                    focus: string (stage focus)
                    duration: string (estimated time)
                    Topics: An array of topic objects (don't provide overview look, provide actual stuffs), each containing:
                        topicName: string
                        resources: An array of resource objects with:
                            title: string
                            type: string (e.g., "video", "docs")

        Output Requirements:
        1. Create at least 3 learning stages (Foundation, Intermediate, Advanced)
        2. Each stage should have 2 or more topics
        3. Provide diverse resources for each topic
        4. Ensure resources are practical and cover different learning methods
        5. The learning path should progressively increase in complexity
        6. Include a mix of video tutorials, documentation, and practical exercises`;

    return prompt;

    //     const prompt = `
    //     Generate a detailed learning path for ${topic} at ${level} level.
    //     Background: ${background}

    //     Please include:
    //         Prerequisites: An array of objects, each containing three attributes:
    //             type (e.g., "required" or "recommended")
    //             title (e.g., "Basic programming knowledge").
    //             Material: a string (docs or youtube) which one is better to learn this topic.

    //         Learning Stages: An object describing the stages of the learning process, Learning Stages contains two attributes:
    //             description (a little description)
    //             stages: An Array of object explain different stages of learning , in which each object includes three attributes:
    //                 name: string , name of the stages,
    //                 focus: string , focus of the stages, 
    //                 duration: in string.

    //         Topics: An array of objects (atleasst 2-3 topics), each representing a specific topic within a learning stage, containing:
    //             topicName (name of the topic)
    //             resources, an object with the following fields:
    //                 youtubeVideos: An object containing videoTitle, videoURL, channelName, and duration.
    //                 documentationLinks: String of URL.
    //                 udemyCourses: An objects with courseTitle, rating, and price.
    //                 freeResources: string of URL.
    //                 practiceExercises: An objects with exerciseTitle and projectIdea
    //     `;
    //     return prompt;
}
// Format the response as a structured JSON object.
export const promptForDocs = (Topics: any) => {
    const promptForDocsReference = `You are a well-trained chatbot designed to provide real website links on any topic the user asks about. 
    These links should help the user explore, understand, and learn from the websites effectively.

    Provide actual links (don't provide youtube videos pls) for the following topics: ${Topics.join(', ')}

    The output should be an array of objects in the following format:
    [
        {
            "title": "Topic 1 Crash Course",
            "link": Link for The topic 
        },
        {
            "title": "Topic 2 Crash Course",
            "link": Link for The topic 
        },
        ...
    ]
    Each object in the array should contain a title that ends with "Crash Course" and its corresponding link.
    `;

    return promptForDocsReference;
};


export const PromptChecker = (query: any, level: any, background: any) => {
    const PROMPT_TEMPLATE = `
        System: You are a prompt validator that ensures learning roadmap requests are valid and contextually aligned.

        Input Analysis:
        Query: ${query}
        Level: ${level}
        Background: ${background} ( if background is empty then fine )

        Validation Rules:
        1. Query must focus on learning materials and roadmap
        2. Background should align with the query context
        3. No implementation or command requests allowed
        5. Query should be about gaining knowledge, not executing tasks
        6. Background data should not contain any scripts
        7. Background must not contain code, URLs, or sensitive information

        Based on these rules, analyze if this is a VALID learning roadmap request.
        If any rule is violated, mark as WRONG
        If all rules pass, mark as CORRECT.
        OUTPUT format: {"status": WRONG | CORRECT , "issue": A String mention any one issue u found in the inputs...}
        `
    return PROMPT_TEMPLATE
}

export const ModelConfig = () => {
    console.log(apiKey)
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: {
            responseMimeType: "application/json"
        },
    });
    return model;
}


export function simplifyTimestamp(timestamp: string): string {
    const [hours, minutes, seconds] = timestamp.split(':').map(Number);

    // Convert to total minutes, rounding seconds down
    let totalMinutes = hours * 60 + minutes;

    // Construct output
    const simplifiedHours = Math.floor(totalMinutes / 60);
    const simplifiedMinutes = totalMinutes % 60;

    if (simplifiedHours > 0) {
        return `${simplifiedHours} hr ${simplifiedMinutes} minutes`;
    } else {
        return `${simplifiedMinutes} minutes`;
    }
}


export const checkVideoLength = (duration: string): boolean => {
    let totalMinutes = 0;

    // Extract hours and minutes from the string
    const hoursMatch = duration.match(/(\d+)\s*hr/);
    const minutesMatch = duration.match(/(\d+)\s*minute/);

    // Convert hours to minutes and add
    if (hoursMatch) {
        totalMinutes += parseInt(hoursMatch[1]) * 60;
    }

    // Add minutes
    if (minutesMatch) {
        totalMinutes += parseInt(minutesMatch[1]);
    }

    // Check if total minutes are less than 5
    return totalMinutes > 5;
};



export const learningData = {
    Prerequisites: [
        {
            type: "required",
            title: "Basic programming knowledge",
            Material: "docs",
        },
        {
            type: "recommended",
            title: "Understanding of algorithms",
            Material: "youtube",
        },
        {
            type: "required",
            title: "Problem-solving mindset",
            Material: "docs",
        }
    ],
    LearningStages: {
        description: "This outlines the step-by-step process to master the subject.",
        stages: [
            {
                name: "Foundation",
                focus: "Building core concepts",
                duration: "2 weeks",
                Topics: [
                    {
                        topicName: "Introduction to Programming",
                        resources: [
                            {
                                title: "Programming Basics for Beginners",
                                url: "https://youtube.com/example1",
                                channelName: "CodeAcademy",
                                duration: "15 mins",
                                type: "video"
                            },
                            {
                                title: "React Crash Course",
                                link: "https://react-icons.github.io/react-icons/",
                                type: "docs"
                            },
                        ],
                    },
                    {
                        topicName: "Introduction to Programming",
                        resources: [
                            {
                                title: "Programming Basics for Beginners",
                                url: "https://youtube.com/example1",
                                channelName: "CodeAcademy",
                                duration: "15 mins",
                                type: "video"
                            },
                            {
                                title: "React Crash Course",
                                link: "https://react-icons.github.io/react-icons/",
                                type: "docs"
                            },
                        ],
                    },
                ]
            },
            {
                name: "Intermediate",
                focus: "Deepen knowledge and apply concepts",
                duration: "4 weeks",
                Topics: [
                    {
                        topicName: "Introduction to Programming",
                        resources: [
                            {
                                title: "Programming Basics for Beginners",
                                url: "https://youtube.com/example1",
                                channelName: "CodeAcademy",
                                duration: "15 mins",
                                type: "video"
                            },
                            {
                                title: "React Crash Course",
                                link: "https://react-icons.github.io/react-icons/",
                                type: "docs"
                            },
                        ],
                    },
                    {
                        topicName: "Introduction to Programming",
                        resources: [
                            {
                                title: "Programming Basics for Beginners",
                                url: "https://youtube.com/example1",
                                channelName: "CodeAcademy",
                                duration: "15 mins",
                                type: "video"
                            },
                            {
                                title: "React Crash Course",
                                link: "https://react-icons.github.io/react-icons/",
                                type: "docs"
                            },
                        ],
                    },
                ]
            },
            {
                name: "Advanced",
                focus: "Specialized skills and practical projects",
                duration: "6 weeks",
                Topics: [
                    {
                        topicName: "Introduction to Programming",
                        resources: [
                            {
                                title: "Programming Basics for Beginners",
                                url: "https://youtube.com/example1",
                                channelName: "CodeAcademy",
                                duration: "15 mins",
                                type: "video"
                            },
                            {
                                title: "React Crash Course",
                                link: "https://react-icons.github.io/react-icons/",
                                type: "docs"
                            },
                        ],
                    },
                    {
                        topicName: "Introduction to Programming",
                        resources: [
                            {
                                title: "Programming Basics for Beginners",
                                url: "https://youtube.com/example1",
                                channelName: "CodeAcademy",
                                duration: "15 mins",
                                type: "video"
                            },
                            {
                                title: "React Crash Course",
                                link: "https://react-icons.github.io/react-icons/",
                                type: "docs"
                            },
                        ],
                    },
                ]
            },
        ],
    },
    // Topics: [
    //     {
    //         topicName: "Introduction to Programming",
    //         resources: {
    //             youtubeVideos: {
    //                 videoTitle: "Programming Basics for Beginners",
    //                 videoURL: "https://youtube.com/example1",
    //                 channelName: "CodeAcademy",
    //                 duration: "15 mins",
    //             },
    //             documentationLinks: "https://example.com/programming-basics",
    //             udemyCourses: {
    //                 courseTitle: "Master Programming Basics",
    //                 rating: 4.8,
    //                 price: "$19.99",
    //             },
    //             freeResources: "https://freecodecamp.org",
    //             practiceExercises: {
    //                 exerciseTitle: "Write a basic calculator program",
    //                 projectIdea: "Create a simple number guessing game",
    //             },
    //         },
    //     },
    //     {
    //         topicName: "Data Structures",
    //         resources: {
    //             youtubeVideos: {
    //                 videoTitle: "Data Structures Explained",
    //                 videoURL: "https://youtube.com/example2",
    //                 channelName: "CS Simplified",
    //                 duration: "25 mins",
    //             },
    //             documentationLinks: "https://example.com/data-structures",
    //             udemyCourses: {
    //                 courseTitle: "Master Data Structures",
    //                 rating: 4.5,
    //                 price: "$29.99",
    //             },
    //             freeResources: "https://geeksforgeeks.org",
    //             practiceExercises: {
    //                 exerciseTitle: "Implement a stack and queue",
    //                 projectIdea: "Build a to-do list application",
    //             },
    //         },
    //     },
    //     {
    //         topicName: "Algorithms",
    //         resources: {
    //             youtubeVideos: {
    //                 videoTitle: "Introduction to Algorithms",
    //                 videoURL: "https://youtube.com/example3",
    //                 channelName: "Algo Expert",
    //                 duration: "30 mins",
    //             },
    //             documentationLinks: "https://example.com/algorithms",
    //             udemyCourses: {
    //                 courseTitle: "Learn Algorithms",
    //                 rating: 4.7,
    //                 price: "$25.99",
    //             },
    //             freeResources: "https://khanacademy.org",
    //             practiceExercises: {
    //                 exerciseTitle: "Solve basic sorting problems",
    //                 projectIdea: "Develop a pathfinding visualizer",
    //             },
    //         },
    //     },
    // ],
};



export const MermaidPromptGenerator = (topics: any) => {
    const MermaidPrompt = `
    Create a Mermaid flowchart code for a learning roadmap with the following specifications:

    1. Use the flowchart TD (top-down) directive
    2. Include these learning stages and their sub-steps:
    ${topics}

    Requirements for the code:
    - Use proper Mermaid syntax for flowchart TD
    - Create subgraphs for main categories/stages
    - Include clear node connections using -->
    - Add descriptive labels for each node
    - Use line breaks (<br/>) for multiple items in a single node
    - Style important nodes (optional: fill colors for start/end nodes)
    - Format text properly within nodes using square brackets []
    - Group related concepts using subgraph when applicable

    Format the steps as follows:
    - Main stages should be in subgraphs
    - Use descriptive node IDs (like 'Basics', 'Advanced', etc.)
    - Include multiple items in nodes using line breaks
    - Show clear progression paths
    - Include decision points using diamonds where paths diverge

    Example of expected node format:
    NodeID[Main Topic<br/>-Subtopic 1<br/>-Subtopic 2]

    Optional styling elements to include:
    - style NodeID fill:#color
    - Different arrow types (-->, -.->)
    - Node shapes ([], (), {}, [()], etc.)

    Please generate only the Mermaid code without any additional explanations or markdown formatting.
    `
    return MermaidPrompt
}


export const extractTopics = (parsedData: any) => {
    const mainTopics = parsedData.LearningStages.stages.map((stage: any) => {
        return {
            mainTopic: stage.name,
            subTopics: stage.Topics.map((topic: any) => topic.topicName),
        };
    });

    return mainTopics;
};




const transformToStandardFormat = (inputData: any) => {
    // Helper function to generate unique IDs
    const generateId = (prefix: any, index: any) => `${prefix}_${index}`;

    // Transform prerequisites
    const prerequisites = inputData.Prerequisites.map((prereq: any, index: any) => ({
        id: generateId('prereq', index + 1),
        type: prereq.type,
        title: prereq.title,
        description: prereq.title, // Using title as description since original doesn't have description
        resourceType: prereq.Material,
        timeEstimate: '1-2 weeks' // Default estimate since original doesn't specify
    }));

    // Transform learning stages into milestones
    const milestones = inputData.LearningStages.stages.map((stage: any, stageIndex: any) => {
        // Group topics into modules
        const modules = stage.Topics.map((topic: any, topicIndex: any) => ({
            id: generateId(`${stage.name.toLowerCase()}_mod`, topicIndex + 1),
            title: topic.topicName,
            description: `Learn ${topic.topicName}`,
            duration: calculateModuleDuration(topic.resources),
            order: topicIndex + 1,
            type: 'concept',
            resources: topic.resources.map((resource: any) => ({
                type: resource.type,
                title: resource.title,
                url: resource.url,
                duration: resource.duration || 'N/A',
            }))
        }));

        // Create milestone object
        return {
            id: generateId('milestone', stageIndex + 1),
            title: stage.name,
            description: stage.focus,
            duration: stage.duration,
            order: stageIndex + 1,
            requiredFor: stageIndex < inputData.LearningStages.stages.length - 1
                ? [generateId('milestone', stageIndex + 2)]
                : [],
            modules,
            projects: [
                {
                    id: generateId(`${stage.name.toLowerCase()}_project`, 1),
                    title: `${stage.name} Project`,
                    description: `Apply ${stage.name} concepts in a project`,
                    duration: '1 week',
                    difficulty: 'beginner',
                    skills: [stage.name],
                    requirements: modules.map((m: any) => m.id)
                }
            ]
        };
    });

    // Create the standardized format
    return {
        metadata: {
            title: "Learning Path", // You might want to pass this as a parameter
            description: inputData.LearningStages.description,
            estimatedTime: calculateTotalDuration(inputData.LearningStages.stages),
            difficulty: "Beginner to Advanced",
            author: "AI Learning Assistant"
        },
        prerequisites,
        milestones
    };
};

// Helper functions
const calculateModuleDuration = (resources: any) => {
    // Simple duration calculation logic
    return "1 week";
};

const calculateResourcesDuration = (resources: any) => {
    // Sum up the durations of resources
    return resources.reduce((total: any, resource: any) => {
        if (resource.duration) {
            // Convert all durations to minutes and sum
            const minutes = parseDuration(resource.duration);
            return total + minutes;
        }
        return total;
    }, 0) + " minutes";
};

const calculateTotalDuration = (stages: any) => {
    // Sum up the durations of all stages
    const totalWeeks = stages.reduce((total: any, stage: any) => {
        const weeks = parseInt(stage.duration);
        return total + (isNaN(weeks) ? 0 : weeks);
    }, 0);

    return `${totalWeeks} weeks`;
};

const parseDuration = (duration: any) => {
    if (typeof duration !== 'string') return 0;
    const match = duration.match(/(\d+)\s*mins/);
    return match ? parseInt(match[1]) : 0;
};

// Example usage:
// const standardizedData = transformToStandardFormat(parsedData);

// Test the transformation
export const TransformData = (parsedData: any) => {
    const transformedData1 = transformToStandardFormat(parsedData);
    return transformedData1
}



export const TransformDataToStandard = (parsedData: any) => {
    // Add completed flag to prerequisites
    if (parsedData.Prerequisites) {
        parsedData.Prerequisites = parsedData.Prerequisites.map((prerequisite:any) => ({
            ...prerequisite,
            completed: false
        }));
    }

    // Transform Learning Stages
    if (parsedData.LearningStages && parsedData.LearningStages.stages) {
        parsedData.LearningStages.stages = parsedData.LearningStages.stages.map((stage:any) => {
            // Add completed flag to stage
            const transformedStage = {
                ...stage,
                completed: false
            };

            // Transform Topics within stage
            if (stage.Topics) {
                transformedStage.Topics = stage.Topics.map((topic:any) => {
                    // Add completed and isQuizCompleted flags to topic
                    const transformedTopic = {
                        ...topic,
                        completed: false,
                        isQuizCompleted: false
                    };

                    // Transform resources within topic
                    if (topic.resources) {
                        transformedTopic.resources = topic.resources.map((resource:any) => ({
                            ...resource,
                            completed: false
                        }));
                    }

                    return transformedTopic;
                });
            }

            return transformedStage;
        });
    }

    return parsedData;
}


export function generateLearningPathMermaid(learningPathData: any): string {
    let mermaidScript = 'flowchart TB\n\n';

    // Add title
    mermaidScript += `    title[["${learningPathData.metadata.title}"]]\n`;
    mermaidScript += `    style title fill:#f9f,stroke:#333,color:#000,stroke-width:4px\n\n`;

    // Start node
    mermaidScript += `    start((Start Journey))\n`;
    mermaidScript += `    style start fill:#90EE90,color:#000,stroke:#333\n\n`;

    // Function to generate a unique color for each topic
    const getTopicColor = (index: number): string => {
        const colors = ['#FFB6C1', '#98FB98', '#87CEEB', '#DDA0DD', '#F0E68C', '#E6E6FA'];
        return colors[index % colors.length];
    };

    // Main Learning Path
    mermaidScript += `    subgraph LearningPath["Complete Learning Path"]\n`;
    mermaidScript += `        direction TB\n`;

    // Process each milestone
    learningPathData.milestones.forEach((milestone: any, milestoneIndex: number) => {
        const milestoneId = `milestone${milestoneIndex + 1}`;

        // Create milestone subgraph
        mermaidScript += `        subgraph ${milestoneId}["${milestone.title} (${milestone.duration})"]\n`;
        // mermaidScript += `            direction TB\n`;

        // Process modules/topics for this milestone
        milestone.modules.forEach((module: any, moduleIndex: number) => {
            const moduleId = `${milestoneId}_mod${moduleIndex + 1}`;
            const topicColor = getTopicColor(moduleIndex);

            // Create module/topic subgraph
            mermaidScript += `            subgraph ${moduleId}["${module.title}"]\n`;
            // mermaidScript += `                direction LR\n`;

            // Create main topic node
            mermaidScript += `                ${moduleId}_main[["${module.title}"]]\n`;
            mermaidScript += `                style ${moduleId}_main fill:${topicColor},stroke:#333,color:#000\n`;

            // Add resources for this topic
            if (module.resources && module.resources.length > 0) {
                module.resources.forEach((resource: any, resourceIndex: number) => {
                    const resourceId = `${moduleId}_res${resourceIndex + 1}`;
                    const resourceSymbol = getResourceSymbol(resource.type);
                    mermaidScript += `                ${resourceId}${resourceSymbol}${resource.title}]\n`;
                    mermaidScript += `                style ${resourceId} text-align:center\n`;
                    mermaidScript += `                ${moduleId}_main --> ${resourceId}\n`;
                });
            }

            mermaidScript += `            end\n\n`;

            // Connect topics sequentially within milestone
            if (moduleIndex > 0) {
                const prevModuleId = `${milestoneId}_mod${moduleIndex}`;
                mermaidScript += `            ${prevModuleId}_main --> ${moduleId}_main\n`;
            }
        });

        mermaidScript += `        end\n\n`;

        // Connect milestones sequentially
        if (milestoneIndex > 0) {
            const prevMilestoneId = `milestone${milestoneIndex}`;
            const lastModuleInPrevMilestone = `${prevMilestoneId}_mod${learningPathData.milestones[milestoneIndex - 1].modules.length}`;
            const firstModuleInCurrentMilestone = `${milestoneId}_mod1`;
            mermaidScript += `        ${lastModuleInPrevMilestone}_main --> ${firstModuleInCurrentMilestone}_main\n`;
        }
    });

    mermaidScript += `    end\n\n`;

    // Connect start to first topic
    mermaidScript += `    start --> milestone1_mod1_main\n`;

    // Add completion node
    mermaidScript += `    complete((Complete))\n`;
    mermaidScript += `    style complete fill:#98FB98,stroke:#333,stroke-width:4px\n`;

    // Connect last topic to complete
    const lastMilestone = learningPathData.milestones[learningPathData.milestones.length - 1];
    const lastModuleId = `milestone${learningPathData.milestones.length}_mod${lastMilestone.modules.length}`;
    mermaidScript += `    ${lastModuleId}_main --> complete\n`;

    return mermaidScript;
}

// Helper function to get resource symbol based on type
function getResourceSymbol(resourceType: string): string {
    switch (resourceType.toLowerCase()) {
        case 'video':
            return '[🎥 ';
        case 'article':
            return '[📄 ';
        case 'exercise':
            return '[⚡ ';
        case 'tutorial':
            return '[👨‍💻 ';
        case 'documentation':
            return '[📚 ';
        default:
            return '[📌 ';
    }
}
