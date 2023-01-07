import DefinitionList from "../DefinitionList";

function AudioFileDefinitionList({ defs }) {
  const placeholderDetails = [
    ["type", ".."],
    ["size", "..", "Kb"],
    ["duration", "..", "Seconds"],
  ];

  let formattedDefs = [];
  if (defs) {
    formattedDefs = [
      ["size", defs.size_in_kb],
      ["duration", defs.duration_in_seconds],
    ];
  }

  return <DefinitionList defs={defs ? formattedDefs : placeholderDetails} />;
}

export default AudioFileDefinitionList;
