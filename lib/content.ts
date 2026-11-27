export const nav=[["Home","/#home"],["Academy","/academy"],/* LATER: ["Technologies","/#divisions"], */["Research","/#divisions"],/* LATER: ["Products","/#divisions"], */["Projects","/#projects"],["About","/#about"],["Blog","/blog"],["Contact","/#contact"]];
// status: "planned" until operationally launched. Edit here.
export const divisions=[
 {n:"KAIZO ACADEMY",s:"Technology education and professional upskilling",d:"Practical AI and technology education built on implementation, mentorship and project-based learning.",f:["Artificial Intelligence","Machine Learning","Deep Learning","Generative AI & LLMs","RAG & AI Agents","Python & Data Science","Cloud & deployment"],cta:"Explore Academy",href:"/academy",status:"Programme in preparation"},
/* LATER (Technologies):
 {n:"KAIZO TECHNOLOGIES",s:"AI and software development",d:"AI applications, machine learning solutions and intelligent business systems.",f:["AI application development","ML solutions","Web applications","Data analytics","Automation","Cloud solutions"],cta:"Explore Technologies",href:"#contact",status:"Planned"}, */
 {n:"KAIZO RESEARCH",s:"Advanced research and innovation",d:"Exploring frontier areas of AI and scientific computing.",f:["Quantum AI","Computer Vision","NLP","Healthcare AI","Scientific computing","Hybrid quantum-classical computing"],cta:"Explore Research",href:"#contact",status:"Planned"},
/* LATER (Products):
, {n:"KAIZO PRODUCTS",s:"Build and launch intelligent products",d:"Intelligent tools and platforms, built to be used.",f:["AI-powered applications","Intelligent assistants","Automation platforms","Educational technology","Data intelligence tools"],cta:"Explore Products",href:"#contact",status:"Planned"} */
];
export const benefits=[
 ["Practical hands-on learning","You write code, practise techniques and implement concepts instead of only watching lectures."],
 ["Real-world projects","Machine Learning, Deep Learning, Generative AI, RAG applications, AI agents and AI-powered apps."],
 ["Personal mentorship","Doubt-clearing sessions, technical guidance, code reviews, project feedback and learning support."],
 ["Portfolio development","GitHub organisation, portfolio guidance, project documentation and demonstrating your abilities."],
 ["Career preparation","Resume guidance, technical interview practice (Python, SQL, AI/ML) and career direction. No placement is guaranteed."],
 ["Deployment experience","Turn working models into usable applications with APIs, frameworks and deployment tools."],
 ["Learning community","Peer collaboration, group activities, knowledge sharing and project discussions."]];
export const extras=["Learning materials","Practice datasets","Free introductory workshops","Project review sessions","Scholarships for eligible students","Alumni learning community"];
export const journey=[["Learn","Understand the concepts."],["Code","Practise with live coding."],["Build","Create practical projects."],["Deploy","Publish working applications."],["Showcase","Present projects and portfolio."]];
export const modules=[
 ["Python Foundations",["Python fundamentals","Functions","OOP","Data structures","Problem solving"]],
 ["Data Science",["NumPy","Pandas","Matplotlib","Data cleaning","Data visualisation","Statistics fundamentals"]],
 ["Machine Learning",["Regression","Classification","Clustering","Feature engineering","Model evaluation","Scikit-learn"]],
 ["Deep Learning",["Neural networks","CNN","TensorFlow or PyTorch","Model training and evaluation"]],
 ["Generative AI",["LLM fundamentals","Prompt engineering","Embeddings","Vector databases","RAG systems","LangChain","AI agents"]],
 ["Deployment",["APIs","Streamlit or equivalent","Application deployment","Git and GitHub"]]];
export const programMeta=[["Duration","To be announced"],["Class format","To be announced"],["Prerequisites","To be announced"],["Fees & batch dates","To be announced"]];
export const projects=[
 ["Crop Disease Detection","Farmers need early, low-cost diagnosis of leaf diseases.","CNN, PyTorch/TensorFlow, Streamlit"],
 ["RAG Knowledge Assistant","Teams cannot search large document sets quickly.","Embeddings, vector DB, LangChain, LLM API"],
 ["Medical Image Analysis","Clinicians need assistive triage on imaging data.","CNN, computer vision, Python"],
 ["Intelligent Data Analytics","Business users need insights without writing code.","Pandas, scikit-learn, dashboards"]];
export const programmes=["Applied AI & Machine Learning","Generative AI & Agentic AI Development","Cloud Computing & Multi-Cloud Engineering (enquiry)","Free introductory session","Research collaboration","Other"];

// ---------- Courses (edit here) ----------
const w = (t: string, topics: string, p: string) => ({ t, topics: topics.split(";"), p });
export const foundingBatchFee = 2750;
export const formatINR = (amount: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
export const FEE = formatINR(foundingBatchFee);
export const feeStatus = "Proposed founding-batch fee · subject to confirmation";
// Proposed delivery allocation. Keep the figures configurable and unpublished as confirmed until KAIZO verifies delivery.
export const proposedTraining = {
  totalHours: 120,
  liveInstructionHours: 60,
  guidedLabHours: 30,
  supervisedProjectHours: 30,
  confirmed: false,
};
export const proposedSchedule = {
  daysPerWeek: null as number | null,
  hoursPerScheduledDay: null as number | null,
  calendarWeeks: 8,
  confirmed: false,
};
export const SCHOLARSHIP_ENABLED = false; // show only after eligibility and availability are confirmed
export const BATCH_DATES = "To be announced";
export const commonBenefits = ["Live interactive classes","Practical coding sessions","Hands-on projects","Learning materials","Practice datasets","Personal mentoring","Doubt-clearing support","Code reviews","GitHub portfolio guidance","Project documentation","Deployment experience","Resume guidance","Technical interview preparation","Completion certificate (based on completion criteria)","Learning community"];
export const methodology = ["Weekly assignments","Weekly assessments","Coding exercises","Doubt-clearing sessions","Code reviews","Project milestones","Final capstone presentation"];
export const courses = [
 { slug: "applied-ai-machine-learning", n: "Applied AI & Machine Learning", tag: "Learn AI. Build Models. Solve Real Problems.", training: proposedTraining, fee: foundingBatchFee, schedule: proposedSchedule,
   level: "Beginner friendly", prereq: "Basic computer knowledge. Python is taught from the beginning.",
   obj: "Understand the complete AI/ML development lifecycle, from Python fundamentals and data processing to model development, evaluation and deployment.",
   audience: ["College students","Fresh graduates","Beginners in AI and Machine Learning","Aspiring data scientists","Software developers interested in AI"],
   outcome: ["Complete practical Python, data science and ML exercises","Build, evaluate and tune machine learning models","Train an introductory deep learning image model","Deploy a model as a simple application","Deliver at least one substantial, documented capstone project"],
   caps: ["Crop disease detection","Customer churn prediction","Sales forecasting","Medical image classification","Intelligent recommendation system"],
   focus: ["Python foundations","Data science","Machine learning","Deep learning","Introductory NLP","Model deployment"],
   weeks: [
    w("Python Programming Foundations","Syntax, variables and data types;Conditionals and loops;Functions;Data structures;Object-oriented programming;Practical coding exercises","Python-based application"),
    w("Data Science and Data Analysis","NumPy;Pandas;Matplotlib and Seaborn;Data cleaning and missing values;Exploratory data analysis;Statistics fundamentals","Real-world dataset analysis"),
    w("Machine Learning Fundamentals","Supervised vs unsupervised learning;Linear and logistic regression;Classification;Train/test split;Scikit-learn","Prediction model"),
    w("Machine Learning Algorithms","Decision Trees;Random Forest;K-Nearest Neighbours;Support Vector Machines;K-Means clustering;Model comparison","Classification system"),
    w("Advanced ML Workflows","Feature engineering and selection;Preprocessing pipelines;Cross-validation;Model evaluation;Hyperparameter tuning;Overfitting and underfitting","End-to-end ML pipeline"),
    w("Deep Learning","Neurons and activation functions;Forward and backward propagation concepts;TensorFlow or PyTorch;Convolutional Neural Networks;Image classification","Image classification application"),
    w("NLP and Introduction to Generative AI","NLP fundamentals;Text preprocessing and tokenisation;Text classification;Introduction to transformers and LLMs;Introduction to prompt engineering","Text intelligence application"),
    w("Deployment and Capstone","Model deployment;Streamlit;APIs;Git and GitHub;Project documentation;Final presentation","Capstone project")],
   faq: [["Do I need to know Python?","No. The first curriculum module teaches Python from the beginning. Basic computer knowledge is enough."],["Will I master deep learning from this course?","The curriculum provides a foundation and an opportunity to build an introductory image model. Mastery takes longer practice."]] },
 { slug: "generative-ai-agentic-ai", n: "Generative AI & Agentic AI Development", tag: "Build LLM Applications. Create AI Agents. Deploy Intelligent Systems.", training: proposedTraining, fee: foundingBatchFee, schedule: proposedSchedule,
   level: "Requires basic Python", prereq: "Basic Python programming and familiarity with programming concepts. This course does not teach Python from scratch.",
   obj: "Develop practical applications using LLMs, embeddings, vector databases, Retrieval-Augmented Generation, AI agents and deployment frameworks.",
   audience: ["Students with Python knowledge","AI/ML learners","Fresh graduates","Developers","Aspiring GenAI engineers"],
   outcome: ["Build a working GenAI application","Understand RAG architecture and evaluate answer quality","Build an introductory tool-using AI agent","Handle API keys, logging and testing responsibly","Deploy and document a capstone project"],
   caps: ["Intelligent PDF research assistant","AI customer support assistant","Domain-specific RAG chatbot","Multi-tool AI research agent","AI knowledge management system"],
   focus: ["LLMs","Prompt engineering","Embeddings","Vector databases","RAG","LangChain","AI agents","GenAI application deployment"],
   weeks: [
    w("Generative AI Fundamentals","Generative AI and LLMs;Transformer architecture concepts;Tokens and context windows;Prompt engineering;Capabilities and limitations","Prompt engineering toolkit"),
    w("LLM Application Development","LLM APIs and integration;Structured outputs;Function calling;Conversation history;Error handling;Basic application architecture","LLM-powered assistant"),
    w("Embeddings and Vector Databases","Embedding fundamentals;Semantic similarity;Vector search;Chroma or FAISS;Data ingestion and indexing;Retrieval","Semantic document search"),
    w("Retrieval-Augmented Generation","RAG architecture;Document loaders;Text chunking;Vector stores and retrieval;LangChain;Document Q&A application","PDF knowledge assistant"),
    w("Advanced RAG","Retrieval strategies;Metadata filtering;Hybrid search concepts;Reranking;Retrieval and answer evaluation;Hallucination reduction","Improved domain-specific RAG assistant"),
    w("AI Agents","Agent fundamentals;Tool calling;Agent workflows;Memory concepts;Multi-step execution;Human approval and control;Agent evaluation","Tool-using AI agent"),
    w("Application Development and Deployment","FastAPI;Streamlit;Application architecture;Environment variables and API key security;Logging and testing;Deployment","Deployed GenAI application"),
    w("Capstone Development","Project planning;System architecture;Implementation and testing;Evaluation;Documentation and GitHub;Final presentation","Capstone project")],
   faq: [["Do I have to pay for LLM APIs?","We aim to use open-source and free-tier options wherever possible. Any paid API usage will be optional and low-cost; tool choices are confirmed before each batch."],["Can I join without Python?","Not yet. Take Applied AI & Machine Learning first, or learn Python basics before joining."]] }];
export type Course = (typeof courses)[number];
export const commonFaq = [["What is the fee?", `${FEE} is the proposed founding-batch fee per student, subject to confirmation.`],["Is a job guaranteed?","No. We offer resume guidance and interview preparation, but we do not promise jobs or placements."],["How do I get the certificate?","Certificates are issued based on completion criteria, which we share at enrolment."],["When does the next batch start?","Batch dates are " + BATCH_DATES + ". Send an enquiry and we will share confirmed details."]];
export const compareRows: [string, string, string][] = [
 ["Best for","Beginners, students, aspiring data scientists","Learners who already code in Python"],
 ["Prerequisite","Basic computer knowledge","Basic Python programming (required)"],
 ["You learn","Python, data science, ML, deep learning, intro NLP, deployment","LLMs, prompts, embeddings, vector databases, RAG, LangChain, agents, GenAI deployment"],
 ["You build","An end-to-end ML capstone","A working GenAI application"],
 ["Schedule and proposed fee","To be confirmed · " + FEE + " proposed","To be confirmed · " + FEE + " proposed"]];

// ---------- Contact and proof (edit here) ----------
export const PHONE_DISPLAY = "+91 91508 35164";
export const PROOF = {
  learnersTrained: "", // e.g. "100". Fill ONLY when you can back it up (attendance sheet, feedback, certificates).
  period: "",          // e.g. "last month"
  testimonials: [] as { q: string; n: string; r: string }[], // real quotes only, with the student's permission
};
export const FEEDBACK_FORM_URL = process.env.NEXT_PUBLIC_FEEDBACK_FORM_URL ?? "";

export const cloudCourse = { n: "Cloud Computing & Multi-Cloud Engineering", tag: "Details to be announced" }; // add real duration, fee and curriculum when confirmed
