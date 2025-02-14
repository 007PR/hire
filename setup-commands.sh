# Create new Next.js project with TypeScript
npx create-next-app@latest ai-recruiter --typescript --tailwind --eslint

# Navigate to project directory
cd ai-recruiter

# Install necessary dependencies
npm install @prisma/client axios openai pdf-lib react-dropzone @headlessui/react
npm install -D prisma @types/pdf-lib

# Install AI and processing related packages
npm install langchain pdf-parse