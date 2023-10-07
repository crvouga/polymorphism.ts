import { Project, SyntaxKind } from "ts-morph";

const project = new Project();
const sourceFiles = project.addSourceFilesAtPaths("./**/*.ts");

// Map to hold function names and their corresponding types
const implementations: { [key: string]: Set<string> } = {};

// Scan for `.impl<T>` calls and record them
sourceFiles.forEach((sourceFile) => {
  const calls = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression);
  calls.forEach((call) => {
    if (call.getExpression().getText().endsWith(".impl")) {
      const funcName = call
        .getExpression()
        .getFirstChildByKind(SyntaxKind.PropertyAccessExpression)
        ?.getExpression()
        .getText();
      const typeName =
        call.getTypeArguments()[0]?.getText() ||
        call.getArguments()[0]?.getType().getText();
      if (funcName && typeName) {
        if (!implementations[funcName]) {
          implementations[funcName] = new Set();
        }
        implementations[funcName].add(typeName);
      }
    }
  });
});

// Generate content for the output file
let generatedContent = "// Generated polymorphic functions\n\n";

for (const [funcName, typeSet] of Object.entries(implementations)) {
  const typesArray = Array.from(typeSet);
  const unionType = typesArray.join(" | ");

  generatedContent += `type ${funcName}Type = ${unionType};\n`;
  generatedContent += `export function ${funcName}(shape: ${funcName}Type): number {\n  switch(shape.constructor.name) {\n`;

  typesArray.forEach((type) => {
    generatedContent += `    case '${type}': return ${funcName}Impls['${type}'](shape);\n`;
  });

  generatedContent +=
    "    default: throw new Error(`No implementation found for type ${shape.constructor.name}`);\n  }\n}\n\n";
}

generatedContent += "const areaImpls: { [key: string]: Function } = {};\n";
generatedContent += "const perimeterImpls: { [key: string]: Function } = {};\n";
// ... similarly for other polymorphic functions

// Write the generated content to an output file
require("fs").writeFileSync(
  "./generated-polymorphism.ts",
  generatedContent,
  "utf8"
);
