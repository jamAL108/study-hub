import dotenv from "dotenv";
import yts from 'yt-search';
dotenv.config({ path: "./config.env" });



function simplifyTimestamp(timestamp) {
    const parts = timestamp.split(':').map(Number);
    if (parts.length === 2) {
        const [minutes, seconds] = parts;
        return `${minutes} minutes`;
    } else if (parts.length === 3) {
        const [hours, minutes, seconds] = parts;
        return `${hours} hr ${minutes} minutes`;
    }
}




export const getYoutubeSearch = async (req, res) => {
    try {
        const data = req.body;
        // console.log("HEEO")
        const youtubeData ={
            url:"https://www.youtube.com/watch?v=kp3fCihUXEg",
            title:"MEOW",
            type:"youtube",
            timestamp:"4:30",
            thumbnail:"MEOE",
            description:"QWERT"
        }
        const youtubePrerequisites = [];
        for (var i = 0; i < data.youtubePrerequisites.length; i++) {
            const prerequisite = data.youtubePrerequisites[i];
            const r = await yts(`${prerequisite.title} in 10-20 minutes`)
            const youtubeData = r.videos[0]
            // console.log(youtubeData)
            youtubePrerequisites.push({
                ...prerequisite,
                resource: {
                    url: youtubeData.url,
                    title: youtubeData.title,
                    duration: simplifyTimestamp(youtubeData.timestamp),
                    thumbnail: youtubeData.thumbnail,
                    description: youtubeData.description,
                    type: 'video'
                }
            })
        }
        const StagesLearning = data.stages;

        let AllDocsResources = [];

        for (let i = 0; i < StagesLearning.length; i++) {
            const topics = [...StagesLearning[i].Topics];

            const newTopics = await Promise.all(topics.map(async (topic) => {
                const resources = await Promise.all(
                    topic.resources.map(async (resource) => {
                        if (resource.type === 'docs') {
                            AllDocsResources.push(resource.title)
                            return resource
                        }
                        try {

                            const r = await yts(`${resource.title} in 10-20 minutes`);

                            if (!r.videos || r.videos.length === 0) {
                                console.warn(`No YouTube video found for: ${resource.title}`);
                                return resource;
                            }

                            const youtubeData = r.videos[0];

                            return {
                                url: youtubeData.url,
                                title: youtubeData.title,
                                duration: simplifyTimestamp(youtubeData.timestamp),
                                thumbnail: youtubeData.thumbnail,
                                description: youtubeData.description,
                                type: 'video'
                            };
                        } catch (error) {
                            console.error(`Error fetching YouTube data for ${resource.title}:`, error);
                            return resource;
                        }
                    })
                );

                return { ...topic, resources };
            }));

            StagesLearning[i].Topics = newTopics;
        }
        // console.log(youtubePrerequisites)
        // console.log(StagesLearning[0].Topics[0].resources)
        return res.status(200).send({ success: true, youtubePrerequisites, StagesLearning , AllDocsResources })
    } catch (err) {
        console.log(err)
        return res.status(404).send({ success: false, error: "Internal Server Error" })
    }
};