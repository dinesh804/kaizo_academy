export const posts = [
 { slug: "ai-ml-roadmap-for-beginners", title: "A practical roadmap to start learning AI and Machine Learning", date: "2026-11-22", summary: "Six steps from zero to your first deployed ML project.", body: [
  "Many beginners jump straight into neural networks and get stuck. A better path builds one skill on top of another.",
  "## 1. Learn Python first","Get comfortable with variables, loops, functions, data structures and basic object-oriented code. Write small programs every day instead of only reading.",
  "## 2. Learn to work with data","Practise NumPy and Pandas, then plot with Matplotlib or Seaborn. Most real ML work is cleaning data and understanding it, not tuning models.",
  "## 3. Understand classic machine learning","Study regression, classification and clustering with scikit-learn. Learn train/test splits, cross-validation and why overfitting happens.",
  "## 4. Build projects","Pick a dataset you care about, such as house prices, crop images or customer churn. Define the problem, train a model, evaluate it honestly and write down what you found.",
  "## 5. Move to deep learning and GenAI","Once the basics are solid, try CNNs for images and then LLM applications. These topics make much more sense after steps 1 to 4.",
  "## 6. Deploy and document","Wrap your model in a simple Streamlit app, push the code to GitHub and write a clear README. A documented project shows your skill better than a certificate list."] },
 { slug: "what-is-rag-beginners-guide", title: "What is RAG? A beginner's guide to Retrieval-Augmented Generation", date: "2026-11-22", summary: "How AI assistants answer questions from your own documents.", body: [
  "Large language models know a lot, but they do not know your private documents, and they sometimes make things up. Retrieval-Augmented Generation (RAG) helps with both problems.",
  "## The idea","Instead of asking the model to answer from memory, we first search your documents for relevant passages and give them to the model together with the question.",
  "## The basic steps","Load the documents, split them into chunks, convert each chunk into an embedding (a list of numbers capturing meaning), store them in a vector database such as Chroma or FAISS, retrieve the chunks closest to the question, and let the model write an answer from them.",
  "## Where it goes wrong","If retrieval returns the wrong chunks, the answer will be poor. Chunk size, metadata filters and reranking all matter. RAG reduces hallucination but does not remove it, so you should evaluate answers against known questions.",
  "## Try it yourself","A PDF question-answering assistant is a classic first project. It teaches embeddings, retrieval and evaluation in one build."] },
 { slug: "machine-learning-vs-generative-ai-which-first", title: "Machine Learning or Generative AI: which should you learn first?", date: "2026-11-22", summary: "A simple way to choose your starting point.", body: [
  "Both fields are popular, but they ask for different starting skills.",
  "## If you are new to programming","Start with Machine Learning. You will learn Python, data handling and how models are trained and evaluated. This foundation helps in every later AI topic.",
  "## If you already write Python","Generative AI is a good next step. You can build LLM applications with APIs, embeddings, vector databases, RAG and simple agents.",
  "## What they share","Both need clear problem definition, careful evaluation and good engineering habits such as version control and documentation.",
  "## Our suggestion","KAIZO ACADEMY offers Applied AI & Machine Learning for beginners and Generative AI & Agentic AI Development for learners with basic Python. Pick the one that matches where you are today."] }];
