// import { Handle, Position } from '@xyflow/react';

// function CustomNode({ data }) {
//   return (
//     <div
//       style={{
//         padding: 10,
//         border: '2px solid #4f46e5',
//         borderRadius: 8,
//         background: 'white',
//         minWidth: 150,
//         textAlign: 'center',
//       }}
//     >
//       <Handle type="target" position={Position.Left}
//         type="target"
//         position={Position.Left}
//         style={{ background: "red", width: 12, height: 12 }}
// />

//       <div>{data.label}</div>

//       <Handle type="source" position={Position.Right} 
//         type="source"
//         position={Position.Right}
//         style={{ background: "blue", width: 12, height: 12 }}
// />
//     </div>
//   );
// }

// export default CustomNode;














import { Handle, Position } from '@xyflow/react';

function CustomNode({ data }) {

  const nodeType = (data?.label || 'Node').replace(/ Node$/, '').trim();

  const nodeConfig = {

    Start: {
      icon: '▶️',
      title: 'Start',
      input: false,
      output: true,
      config: 'Node Name, Description',
    },

    'HTTP Request': {
      icon: '🌐',
      title: 'HTTP Request',
      input: true,
      output: true,
      config: 'Node Name, Description, URL, HTTP Method',
    },

    Delay: {
      icon: '⏱️',
      title: 'Delay',
      input: true,
      output: true,
      config: 'Node Name, Description, Delay Time',
    },

    'Python Function': {
      icon: '🐍',
      title: 'Python Function',
      input: true,
      output: true,
      config: 'Node Name, Description, Python Script',
    },

    Condition: {
      icon: '🔀',
      title: 'Condition',
      input: true,
      output: true,
      config: 'Node Name, Description, Conditions',
    },

    Logger: {
      icon: '📝',
      title: 'Logger',
      input: true,
      output: true,
      config: 'Node Name, Description',
    },

    End: {
      icon: '⏹️',
      title: 'End',
      input: true,
      output: false,
      config: 'Node Name, Description',
    },

    // Existing nodes — keep them working
    Webhook: {
      icon: '⚓',
      title: 'Webhook',
      input: true,
      output: true,
      config: 'Node Name, Description',
    },

    Email: {
      icon: '✉️',
      title: 'Email',
      input: true,
      output: true,
      config: 'Node Name, Description',
    },
  };

  const config = nodeConfig[nodeType] || {
    icon: '⚙️',
    title: nodeType,
    input: true,
    output: true,
    config: 'Node Name, Description',
  };

  return (
    <div
      style={{
        padding: 10,
        border: '2px solid #4f46e5',
        borderRadius: 8,
        background: 'white',
        minWidth: 180,
        textAlign: 'center',
        position: 'relative',
      }}
    >

      {/* INPUT */}

      {config.input && (
        <Handle
          type="target"
          position={Position.Left}
          style={{
            background: 'red',
            width: 12,
            height: 12,
          }}
        />
      )}

      {/* ICON + TITLE */}

      <div
        style={{
          fontWeight: '600',
          marginBottom: 6,
        }}
      >
        {config.icon} {config.title}
      </div>





      {/* INPUT / OUTPUT INFORMATION */}

      <div
        style={{
          fontSize: 12,
          color: '#555',
        }}
      >
        {config.input ? 'Input' : 'No Input'}
        {' → '}
        {config.output ? 'Output' : 'No Output'}
      </div>


{/* DEFAULT CONFIGURATION */}

<div
  style={{
    fontSize: 11,
    color: '#666',
    marginTop: 6,
  }}
>
  Default Configuration: {config.config}
</div>





      {/* OUTPUT */}

      {config.output && (
        <Handle
          type="source"
          position={Position.Right}
          style={{
            background: 'blue',
            width: 12,
            height: 12,
          }}
        />
      )}

    </div>
  );
}

export default CustomNode;