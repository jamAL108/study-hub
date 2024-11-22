'use client'
import React, { useState, useEffect } from 'react'
import { Skeleton } from "@/components/ui/skeleton"

const SkeletonComp = () => {

    return (
        <div className="space-y-3 px-8">
            <Skeleton
                className="h-4 w-[min(100%,550px)]"
            />
            <Skeleton
                className="h-4 w-[min(100%,550px)]"
            />
            <div className='w-full flex gap-10 py-10 flex-wrap'>
                <Skeleton
                    className="h-[100px] w-[350px]"
                />
                <Skeleton
                    className="h-[100px] w-[350px]"
                />
                <Skeleton
                    className="h-[100px] w-[350px]"
                />
                <Skeleton
                    className="h-[100px] w-[350px]"
                />
            </div>
        </div>
    )
}

export default SkeletonComp







// {roadmap !== null && (
//     <div className="space-y-6 roadmap w-full h-auto">
//         {/* Prerequisites Section */}
//         <Card>
//             <CardHeader>
//                 <CardTitle className="text-lg">Prerequisites</CardTitle>
//             </CardHeader>
//             <CardContent>
//                 {roadmap.Prerequisites.map((prereq: any, index: number) => (
//                     <div key={index} className="mb-6 last:mb-0">
//                         <div className="flex items-center gap-2 mb-2">
//                             <h3 className="font-medium">{prereq.description}</h3>
//                             <Badge variant={prereq.type === "Required" ? "destructive" : "secondary"}>
//                                 {prereq.type}
//                             </Badge>
//                         </div>
//                         <ResourceCard resource={prereq.resource} />
//                     </div>
//                 ))}
//             </CardContent>
//         </Card>

//         {/* Learning Path Section */}
//     </div>
// )}