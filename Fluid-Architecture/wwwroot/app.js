mermaid.initialize({ startOnLoad: true, c4: { enable: true } });

var app = new Vue({
    el: '#app',
    data: {
        diagramMeta: null,
        selectedTags: [],
        show:{
            contextDiagram: false,
            containerDiagram: false,
            componentDiagram: false,
            codeLevelDiagram: false,
            contextLevelMermaid: false,
            containerLevelMermaid: false,
            componentLevelMermaid: false,
            codeLevelMermaid: false,
        },
        c4:{
            contextDiagram: null,
            containerDiagram: null,
            componentDiagram: null,
            codeLevelDiagram: null,
        }
    },
    mounted: function () {
        window.sampleStockApp.resources.forEach(resource=>{
            let separatorIndex = resource.type.lastIndexOf(':');
            resource.baseType = separatorIndex > 0 ? resource.type.substring(0, separatorIndex + 1) : '';
            resource.type = resource.type.substring(separatorIndex);
        });
        this.diagramMeta = window.sampleStockApp;
        this.renderMermaid();
    },
    methods: {
        tagClicked(tag){
            const index = this.selectedTags.indexOf(tag);

            if (index < 0) {
                this.selectedTags.push(tag);
            } else {
                this.selectedTags.splice(index, 1);
            }
            
            this.renderMermaid();
        },
        renderMermaid() {
            this.show.contextDiagram = false;
            this.show.containerDiagram = false;
            this.show.componentDiagram = false;
            this.show.codeLevelDiagram = false;
            this.$nextTick(() => {
                this.show.contextDiagram = true;
                this.show.containerDiagram = true;
                this.show.componentDiagram = true;
                this.show.codeLevelDiagram = true;
                this.rebuildDiagrams();
                this.$nextTick(() => {
                    mermaid.init(undefined, this.$refs.contextDiagram);
                    mermaid.init(undefined, this.$refs.containerDiagram);
                    mermaid.init(undefined, this.$refs.componentDiagram);
                    mermaid.init(undefined, this.$refs.codeLevelDiagram);
                });
            });
        },
        rebuildDiagrams(){
            this.c4.contextDiagram = `
            C4Context
            title Stock Context
            
            Person(androidUser, "Android User")
            Person(iosUser, "iOS User")
            
            System(system, "Stock Platform")
            
            Rel(androidUser, system, "Uses")
            Rel(iosUser, system, "Uses")
            `;
            this.c4.containerDiagram = `C4Container
    title Stock Market Platform - Container Diagram

    Person(androidUser, "Android User")
    Person(iosUser, "iOS User")

    System_Ext(realtimeFeed, "Realtime Feed")
    System_Ext(historicalProvider, "Historical Provider")

    System_Boundary(system, "Stock Platform") {

        Container(apiGateway, "API Gateway", "AWS API Gateway", "Entry point for mobile apps")
        Container(auth, "Auth Service", "Amazon Cognito", "Authentication")

        Container(apiService, "API Service", "ECS", "Business logic")

        ContainerDb(dynamo, "UserDataStore", "DynamoDB", "User/session data")
        ContainerDb(rds, "UserPreferencesDB", "RDS", "User preferences")

        Container(stream, "MarketDataStream", "Kinesis", "Real-time ingestion")

        Container(lambdaRealtime, "Realtime Processor", "Lambda", "Processes stream")
        Container(lambdaHistorical, "Historical Ingest", "Lambda", "Fetches historical data")

        Container(stepFn, "Ingestion Workflow", "Step Functions", "Orchestration")

        Container(s3raw, "Raw Data", "S3", "Raw storage")
        Container(s3processed, "Processed Data", "S3", "Cleaned data")
        Container(modelBucket, "Model Bucket", "S3", "ML models")

        Container(glue, "Data Processing", "AWS Glue", "ETL jobs")
        Container(athena, "Analytics", "Athena", "Query engine")

        Container(mlTrain, "ML Trainer", "Lambda", "Triggers training")
        Container(mlEndpoint, "ML Endpoint", "SageMaker", "Inference")

    }

    Rel(androidUser, apiGateway, "Calls")
    Rel(iosUser, apiGateway, "Calls")

    Rel(apiGateway, auth, "Authenticates")
    Rel(apiGateway, apiService, "Routes to")

    Rel(apiService, dynamo, "Reads/Writes")
    Rel(apiService, rds, "Reads/Writes")
    Rel(apiService, mlEndpoint, "Requests predictions")

    Rel(realtimeFeed, stream, "Publishes")
    Rel(stream, lambdaRealtime, "Triggers")

    Rel(lambdaRealtime, s3processed, "Stores")

    Rel(historicalProvider, lambdaHistorical, "Provides data")
    Rel(stepFn, lambdaHistorical, "Triggers")

    Rel(lambdaHistorical, s3raw, "Stores")

    Rel(s3raw, glue, "Input")
    Rel(glue, s3processed, "Output")

    Rel(s3processed, athena, "Queries")

    Rel(s3processed, mlTrain, "Training data")
    Rel(mlTrain, mlEndpoint, "Deploys model")
    Rel(mlTrain, modelBucket, "Stores model")`;
            this.c4.componentDiagram = `C4Component
    title Stock Platform - Component Diagram

    Container(apiService, "API Service", "ECS")

    Component(apiController, "API Controller", "Handles HTTP requests")
    Component(authHandler, "Auth Handler", "Validates tokens")
    Component(userService, "User Service", "User logic")
    Component(predictionService, "Prediction Service", "Calls ML endpoint")

    ContainerDb(dynamo, "DynamoDB")
    ContainerDb(rds, "RDS")
    Container(mlEndpoint, "SageMaker Endpoint", "ML inference")

    Rel(apiController, authHandler, "Uses")
    Rel(apiController, userService, "Calls")
    Rel(apiController, predictionService, "Calls")

    Rel(userService, dynamo, "Reads/Writes")
    Rel(userService, rds, "Reads/Writes")

    Rel(predictionService, mlEndpoint, "Invokes")`;

            let codeLevelDiagramComponents = this.diagramMeta.resources.filter(p=>p.type == 'Component' && (this.selectedTags.length == 0 || p.tags.find(tag => this.selectedTags.indexOf(tag) >= 0)));
            let codeLevelDiagramRelations = this.diagramMeta.relations.filter(rel=> codeLevelDiagramComponents.find(p => p.id == rel.source || p.id == rel.target));
            let codeLevelDiagramExtendedComponents = this.diagramMeta.resources.filter(p=> codeLevelDiagramRelations.find(rel=> p.id == rel.source || p.id == rel.target));
            this.c4.codeLevelDiagram = `C4Component
    title Code-Level (Lambda + ML Components)
    ${(codeLevelDiagramExtendedComponents.map(p=> `Component(architectureId_${p.id}, "${p.name}", "${p.description}")`).join('\n'))}
    ${(codeLevelDiagramRelations.map(rel=> `Rel(architectureId_${rel.source}, architectureId_${rel.target}, "${rel.description}")`).join('\n'))}
    `;
            this.c4.containerDiagram = this.c4.codeLevelDiagram;
            this.c4.contextDiagram = this.c4.codeLevelDiagram;
            this.c4.componentDiagram = this.c4.codeLevelDiagram;
        },
    }
});