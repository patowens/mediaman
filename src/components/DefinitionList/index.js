import "./index.css";

function DefinitionList({ defs }) {
  return (
    <dl className="DefList">
      {defs.map((d, index) => (
        <div key={index}>
          <dt>{d[0].toUpperCase()}</dt>
          <dd>{d[1]} {d[2] ? `(${d[2]})` : null}</dd>
        </div>
      ))}
    </dl>
  );
}

export default DefinitionList;
