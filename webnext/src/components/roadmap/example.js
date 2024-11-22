export const Example = `
flowchart TD
    Start([Start Your Learning Journey]) --> Fundamentals
    
    subgraph Fundamentals[Fundamentals of Programming]
        Basics[Basic Concepts<br/>-Variables & Data Types<br/>-Control Structures<br/>-Functions] --> DS[Data Structures<br/>-Arrays & Strings<br/>-Lists & Maps<br/>-Stacks & Queues]
        DS --> Algo[Basic Algorithms<br/>-Sorting & Searching<br/>-Time Complexity<br/>-Problem Solving]
    end

    Fundamentals --> Choose{Choose Your Path}
    
    Choose -->|Frontend| FE[Frontend Development]
    Choose -->|Backend| BE[Backend Development]
    Choose -->|Full Stack| FS[Full Stack Development]
    
    subgraph FE[Frontend Path]
        HTML[HTML & CSS] --> JS[JavaScript Basics]
        JS --> Framework[Frontend Framework<br/>-React/Vue/Angular]
        Framework --> Advanced_FE[Advanced Topics<br/>-State Management<br/>-Performance<br/>-Testing]
    end
    
    subgraph BE[Backend Path]
        Lang[Choose Language<br/>-Python/Java/Node.js] --> DB[Databases<br/>-SQL<br/>-NoSQL]
        DB --> API[API Development<br/>-REST<br/>-GraphQL]
        API --> Advanced_BE[Advanced Topics<br/>-Security<br/>-Scaling<br/>-DevOps]
    end
    
    FE & BE --> FS
    
    FS --> Projects[Build Projects]
    Projects --> Portfolio[Create Portfolio]
    Portfolio --> Job([Job Ready!])

    style Start fill:#90EE90
    style Job fill:#98FB98
    style Choose fill:#FFE4B5
`