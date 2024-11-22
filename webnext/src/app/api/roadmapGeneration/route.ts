'use server'
import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { promptGenerate, simplifyTimestamp, promptForDocs, PromptChecker, MermaidPromptGenerator, extractTopics, TransformData, generateLearningPathMermaid } from '@/utils/roadmap'

const apiKey1 = process.env.NEXT_PUBLIC_GEMINI || '';
const apikey2 = process.env.NEXT_PUBLIC_GEM || '';
const apikey3 = process.env.NEXT_PUBLIC_GEM_AP || '';

const genAI1 = new GoogleGenerativeAI(apiKey1);
const geminiModel1 = genAI1.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
        responseMimeType: "application/json"
    },
});

const genAI2 = new GoogleGenerativeAI(apikey2);
const geminiModel2 = genAI2.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: { responseMimeType: "application/json" },
});

const genAI3 = new GoogleGenerativeAI(apikey3);
const geminiModel3 = genAI3.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
        responseMimeType: "application/json"
    },
});

// const resource = {
//     url: "https://www.youtube.com/watch?v=ZtMzB5CoekE",
//     title: "Learn Programming in 30 Minutes",
//     duration: "30 minutes",
//     type: 'video'
// }

// const DocsResource = {
//     url: "https://www.youtube.com/watch?v=ZtMzB5CoekE",
//     title: "Learn Programming in 80 Minutes",
//     duration: "10-20 minutes",
//     type: 'docs'
// }

// const parsedLinks = [
//     {
//         "title": "React Crash Course",
//         "link": "https://react-icons.github.io/react-icons/"
//     },
//     {
//         "title": "Node.js Crash Course",
//         "link": "https://example.com/nodejs"
//     },
//     {
//         "title": "JavaScript Crash Course",
//         "link": "https://example.com/javascript"
//     }
// ]






export async function POST(req: NextRequest) {
    // Response.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    // Response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    // Response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Response.setHeader('Access-Control-Allow-Credentials', true);


    // const parsedData = {
    //     Prerequisites: [
    //         {
    //             type: "required",
    //             title: "Basic programming knowledge",
    //             Material: "docs",
    //         },
    //         {
    //             type: "recommended",
    //             title: "Understanding of algorithms",
    //             Material: "youtube",
    //         },
    //         {
    //             type: "required",
    //             title: "Problem-solving mindset",
    //             Material: "docs",
    //         }
    //     ],
    //     LearningStages: {
    //         description: "This outlines the step-by-step process to master the subject.",
    //         stages: [
    //             {
    //                 name: "Foundation",
    //                 focus: "Building core concepts",
    //                 duration: "2 weeks",
    //                 Topics: [
    //                     {
    //                         topicName: "Introduction to Programming",
    //                         resources: [
    //                             {
    //                                 title: "Programming Basics for Beginners",
    //                                 url: "https://youtube.com/example1",
    //                                 channelName: "CodeAcademy",
    //                                 duration: "15 mins",
    //                                 type: "video"
    //                             },
    //                             {
    //                                 title: "React Crash Course",
    //                                 url: "https://react-icons.github.io/react-icons/",
    //                                 type: "docs"
    //                             },
    //                         ],
    //                     },
    //                     {
    //                         topicName: "Introduction to Programming",
    //                         resources: [
    //                             {
    //                                 title: "Programming Basics for Beginners",
    //                                 url: "https://youtube.com/example1",
    //                                 channelName: "CodeAcademy",
    //                                 duration: "15 mins",
    //                                 type: "video"
    //                             },
    //                             {
    //                                 title: "React Crash Course",
    //                                 url: "https://react-icons.github.io/react-icons/",
    //                                 type: "docs"
    //                             },
    //                         ],
    //                     },
    //                 ]
    //             },
    //             {
    //                 name: "Intermediate",
    //                 focus: "Deepen knowledge and apply concepts",
    //                 duration: "4 weeks",
    //                 Topics: [
    //                     {
    //                         topicName: "Introduction to Programming",
    //                         resources: [
    //                             {
    //                                 title: "Programming Basics for Beginners",
    //                                 url: "https://youtube.com/example1",
    //                                 channelName: "CodeAcademy",
    //                                 duration: "15 mins",
    //                                 type: "video"
    //                             },
    //                             {
    //                                 title: "React Crash Course",
    //                                 url: "https://react-icons.github.io/react-icons/",
    //                                 type: "docs"
    //                             },
    //                         ],
    //                     },
    //                     {
    //                         topicName: "Introduction to Programming",
    //                         resources: [
    //                             {
    //                                 title: "Programming Basics for Beginners",
    //                                 url: "https://youtube.com/example1",
    //                                 channelName: "CodeAcademy",
    //                                 duration: "15 mins",
    //                                 type: "video"
    //                             },
    //                             {
    //                                 title: "React Crash Course",
    //                                 url: "https://react-icons.github.io/react-icons/",
    //                                 type: "docs"
    //                             },
    //                         ],
    //                     },
    //                 ]
    //             },
    //             {
    //                 name: "Advanced",
    //                 focus: "Specialized skills and practical projects",
    //                 duration: "6 weeks",
    //                 Topics: [
    //                     {
    //                         topicName: "Introduction to Programming",
    //                         resources: [
    //                             {
    //                                 title: "Programming Basics for Beginners",
    //                                 url: "https://youtube.com/example1",
    //                                 channelName: "CodeAcademy",
    //                                 duration: "15 mins",
    //                                 type: "video"
    //                             },
    //                             {
    //                                 title: "React Crash Course",
    //                                 url: "https://react-icons.github.io/react-icons/",
    //                                 type: "docs"
    //                             },
    //                         ],
    //                     },
    //                     {
    //                         topicName: "Introduction to Programming",
    //                         resources: [
    //                             {
    //                                 title: "Programming Basics for Beginners",
    //                                 url: "https://youtube.com/example1",
    //                                 channelName: "CodeAcademy",
    //                                 duration: "15 mins",
    //                                 type: "video"
    //                             },
    //                             {
    //                                 title: "React Crash Course",
    //                                 url: "https://react-icons.github.io/react-icons/",
    //                                 type: "docs"
    //                             },
    //                         ],
    //                     },
    //                 ]
    //             },
    //         ],
    //     },
    // };


    try {

        const data = await req.json();

        const prom = PromptChecker(data.query, data.level, data.background)
        const res = await geminiModel3.generateContent(prom);
        const respo = await res.response;
        const endres = respo.text();
        console.log(typeof endres);
        console.log(endres)
        const parsedResult = JSON.parse(endres)
        if (parsedResult.status === 'WRONG') {
            return Response.json({ success: false, error: parsedResult.issue });
        }

        

        const prompt = promptGenerate(data.query, data.level, data.background)
        const result = await geminiModel1.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log(typeof text);
        const parsedData = JSON.parse(text)

        let youtubePrerequisites: any[] = [];
        let docsPrerequisites: any[] = [];
        let tempStorage: any[] = [];

        if (Array.isArray(parsedData.Prerequisites)) {
            tempStorage = parsedData.Prerequisites.map((prerequisite: any, index: number) => {
                console.log("Processing:", prerequisite);

                if (prerequisite.Material === "youtube") {
                    console.log("YT match:", prerequisite);
                    youtubePrerequisites.push(prerequisite);
                    return { placeholder: true, originalIndex: index, type: "youtube" };
                } else if (prerequisite.Material === "docs") {
                    console.log("Docs match:", prerequisite);
                    docsPrerequisites.push(prerequisite);
                    return { placeholder: true, originalIndex: index, type: "docs" };
                } else {
                    console.log("No match for Material:", prerequisite.Material);
                    return null; // Or handle other cases if necessary
                }
            });
        }

        let docsStaged: any[] = [];

        // console.log(youtubePrerequisites)

        if (youtubePrerequisites.length !== 0) {
            const resFromYoutube = await fetch("http://localhost:8000/api/getYoutubeSearch", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    youtubePrerequisites,
                    stages: parsedData.LearningStages.stages
                }),
            });
            // console.log(resFromYoutube)
            const parsedResp = await resFromYoutube.json();
            youtubePrerequisites = parsedResp.youtubePrerequisites
            parsedData.LearningStages.stages = parsedResp.StagesLearning
            docsStaged = parsedResp.AllDocsResources

            console.log(docsStaged)
            // console.log(youtubePrerequisites)
        }


        // /comment remove kardo
        let titles = docsPrerequisites.map((item: any) => item.title);
        titles = [...titles, ...docsStaged]
        const prompt2 = promptForDocs(titles)
        const result2 = await geminiModel2.generateContent(prompt2);
        const response2 = await result2.response;
        const text2 = response2.text();
        console.log(text2)
        const parsedLinks = JSON.parse(text2)


        docsPrerequisites = docsPrerequisites.map((prerequisite: any, index: number) => {
            return {
                ...prerequisite,
                resource: {
                    title: parsedLinks[index].title,
                    url: parsedLinks[index].link,
                    type: "docs",
                }
            };
        });

        let indexCount = docsPrerequisites.length;
        const enrichedStages = parsedData.LearningStages.stages
        for (let i = 0; i < enrichedStages.length; i++) {
            for (let j = 0; j < enrichedStages[i].Topics.length; j++) {
                enrichedStages[i].Topics[j].resources = enrichedStages[i].Topics[j].resources.map((resource: any) => {
                    // Only add link if resource type is 'docs'
                    if (resource.type === 'docs') {
                        // Check if we have a link available
                        if (indexCount < parsedLinks.length) {
                            return {
                                title: parsedLinks[indexCount].title,
                                url: parsedLinks[indexCount].link,
                                type: "docs"
                            };
                            // return {
                            //     title: "HELLO",
                            //     url: "HELLO",
                            //     type: "docs"
                            // };
                        }
                        indexCount++
                    }
                    return resource;
                });
            }
        }
        parsedData.LearningStages.stages = enrichedStages
        console.log(parsedData.LearningStages.stages[0].Topics[0])

        // After performing other operations, merge them back in the same order
        parsedData.Prerequisites = tempStorage.map((prerequisite: any) => {
            if (prerequisite.placeholder && prerequisite.type === "youtube") {
                return youtubePrerequisites.shift(); // Replace with youtube item in order
            } else if (prerequisite.placeholder && prerequisite.type === "docs") {
                return docsPrerequisites.shift(); // Replace with docs item in order
            }
            return prerequisite; // Keep as is for non-placeholder items
        });

        const TransformedData: any = TransformData(parsedData)
        const MermaidSciprt: any = generateLearningPathMermaid(TransformedData)
        console.log(MermaidSciprt)
        
        return Response.json({ success: true, data: parsedData, chart: MermaidSciprt });
    } catch (err) {
        console.log(err)
        return Response.json({ success: false, error: err });
    }
}

