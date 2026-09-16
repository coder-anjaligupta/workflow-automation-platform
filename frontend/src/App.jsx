import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
} from 'react';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
} from 'react-router-dom';

import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

import CustomNode from './components/CustomNode';

// ==========================================
// LOGIN PAGE
// ==========================================

const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();

    setLoginMessage('Logging in...');

    try {
      const formData = new URLSearchParams();

      formData.append('username', email);
      formData.append('password', password);

      const response = await fetch(
        'http://localhost:8000/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || 'Login failed'
        );
      }

      // Save JWT token in browser
      localStorage.setItem(
        'access_token',
        data.access_token
      );

      setLoginMessage('Login successful!');

      // Go to workflow canvas
      navigate('/canvas');
    } catch (error) {
      console.error('Login error:', error);

      setLoginMessage(
        `Login failed: ${error.message}`
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">

      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">

        <h1 className="text-2xl font-bold text-blue-700 mb-2">
          Workflow Automation Platform
        </h1>

        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Login
        </h2>

        <form
          onSubmit={handleLogin}
          className="space-y-4"
        >

          {/* EMAIL */}

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="Enter your email"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* PASSWORD */}

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Enter your password"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* LOGIN BUTTON */}

          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition"
          >
            Login
          </button>

        </form>

        {/* LOGIN MESSAGE */}

        {loginMessage && (
          <p className="mt-4 text-sm font-medium text-gray-700">
            {loginMessage}
          </p>
        )}


<p className="mt-5 text-sm text-gray-600 text-center">
  Don't have an account?{' '}

  <button
    type="button"
    onClick={() => navigate('/register')}
    className="text-blue-700 font-semibold hover:underline"
  >
    Register
  </button>
</p>


      </div>

    </div>
  );
};


// ==========================================
// REGISTER PAGE
// ==========================================

const RegisterPage = () => {

  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registerMessage, setRegisterMessage] = useState('');

  const handleRegister = async (event) => {

    event.preventDefault();

    setRegisterMessage('Registering...');

    try {

      const response = await fetch(
        'http://localhost:8000/register',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            name: name,
            email: email,
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {

        throw new Error(
          data.detail || 'Registration failed'
        );

      }

      console.log(
        'Registration successful:',
        data
      );

      setRegisterMessage(
        'Registration successful! Please login.'
      );

      // Go to login page after successful registration
      setTimeout(() => {
        navigate('/login');
      }, 1000);

    } catch (error) {

      console.error(
        'Registration error:',
        error
      );

      setRegisterMessage(
        `Registration failed: ${error.message}`
      );

    }
  };

  return (

    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">

      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">

        <h1 className="text-2xl font-bold text-blue-700 mb-2">
          Workflow Automation Platform
        </h1>

        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Create Account
        </h2>

        <form
          onSubmit={handleRegister}
          className="space-y-4"
        >

          {/* NAME */}

          <div>

            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="Enter your name"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>


          {/* EMAIL */}

          <div>

            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="Enter your email"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>


          {/* PASSWORD */}

          <div>

            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Create a password"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>


          {/* REGISTER BUTTON */}

          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition"
          >
            Register
          </button>

        </form>

        {/* MESSAGE */}

        {registerMessage && (

          <p className="mt-4 text-sm font-medium text-gray-700">
            {registerMessage}
          </p>

        )}

        {/* LOGIN LINK */}

        <p className="mt-5 text-sm text-gray-600 text-center">

          Already have an account?{' '}

          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-blue-700 font-semibold hover:underline"
          >
            Login
          </button>

        </p>

      </div>

    </div>

  );
};

// ==========================================
// PROFILE PAGE
// ==========================================

const ProfilePage = () => {

  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [profileMessage, setProfileMessage] = useState(
    'Loading profile...'
  );

  useEffect(() => {

    const fetchProfile = async () => {

      try {

        const token = localStorage.getItem(
          'access_token'
        );

        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch(
          'http://localhost:8000/profile',
          {
            method: 'GET',

            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {

          throw new Error(
            data.detail || 'Failed to load profile'
          );

        }

        setProfile(data);
        setProfileMessage('');

      } catch (error) {

        console.error(
          'Profile error:',
          error
        );

        setProfileMessage(
          `Failed to load profile: ${error.message}`
        );

      }

    };

    fetchProfile();

  }, [navigate]);

  return (

    <div className="min-h-screen bg-gray-50">

      {/* NAVBAR */}

      <div className="h-[70px] bg-white border-b border-gray-200 flex items-center justify-between px-6">

        <h1 className="text-xl font-bold text-blue-700">
          Workflow Automation Platform
        </h1>

        <button
          onClick={() => navigate('/canvas')}
          className="px-5 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition"
        >
          Back to Canvas
        </button>

      </div>


      {/* PROFILE */}

      <div className="flex items-center justify-center p-6">

        <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8 mt-10">

          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            My Profile
          </h2>


          {profileMessage && (

            <p className="text-sm font-medium text-gray-700">
              {profileMessage}
            </p>

          )}


          {profile && (

            <div className="space-y-4">

              <div>

                <p className="text-sm font-semibold text-gray-500">
                  Name
                </p>

                <p className="text-lg text-gray-800">
                  {profile.name}
                </p>

              </div>


              <div>

                <p className="text-sm font-semibold text-gray-500">
                  Email
                </p>

                <p className="text-lg text-gray-800">
                  {profile.email}
                </p>

              </div>

            </div>

          )}

        </div>

      </div>

    </div>

  );
};

// ==========================================
// 1. FLOW PAGE
// ==========================================

const FlowPage = () => {

  const navigate = useNavigate();
  // ==========================================
  // Backend status message (STATE)
  // ==========================================

  const [backendMessage, setBackendMessage] = useState(
    'Connecting to backend...'
  );

  const [workflowName, setWorkflowName] = useState(
    'My Workflow'
  );

  const [workflowDescription, setWorkflowDescription] = useState(
    'Workflow created from React Flow canvas'
  );

  const [saveMessage, setSaveMessage] = useState('');
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [workflowId, setWorkflowId] = useState(
    () => localStorage.getItem('workflow_id') || null
  );
  const [loadWorkflowId, setLoadWorkflowId] = useState(
    () => localStorage.getItem('workflow_id') || ''
  );

  const [reactFlowInstance, setReactFlowInstance] = useState(null);
// const [isDarkMode, setIsDarkMode] = useState(false);
    
  
    // 1. Export Workflow Function
    
    const handleExport = () => {
    if (!reactFlowInstance) {
      alert("Canvas is not initialized yet!");
      return;
    }
  
    const flow = reactFlowInstance.toObject();
  
    // Save metadata so import can detect ID and Name
    const exportData = {
      id: workflowId || loadWorkflowId || "28",
      name: workflowName || "Imported Workflow",
      ...flow
    };
  
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(exportData, null, 2)
    )}`;
  
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `${workflowName || 'autoflow-workflow'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };
  
    // 2. Import Workflow Function
  
  const handleImport = (event) => {
    const fileReader = new FileReader();
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      fileReader.readAsText(file, "UTF-8");
      fileReader.onload = (e) => {
        try {
          const flow = JSON.parse(e.target.result);
          if (flow) {
            setNodes(flow.nodes || []);
            setEdges(flow.edges || []);
  
            // Read ONLY the real ID stored inside the imported JSON file
            const realFileId = flow.id || flow.workflow_id || flow.workflowId || "";
            const importedName = flow.name || flow.workflow_name || flow.workflowName || file.name.replace('.json', '');
  
            // Update the UI state strictly with the JSON's internal ID
            if (typeof setLoadWorkflowId === 'function') {
              setLoadWorkflowId(realFileId);
            }
            if (typeof setWorkflowId === 'function') {
              setWorkflowId(realFileId);
            }
            if (typeof setWorkflowName === 'function') {
              setWorkflowName(importedName);
            }
  
            if (realFileId) {
              setSaveMessage(`Workflow loaded from JSON! (ID: ${realFileId})`);
            } else {
              setSaveMessage("Workflow loaded from JSON! (No ID found in file)");
            }
          }
        } catch (error) {
          console.error("Invalid JSON file format:", error);
          alert("Failed to import workflow. Please provide a valid JSON file.");
        }
      };
    }
  };


  // ==========================================
  // BACKEND API CONNECTION
  // ==========================================

  useEffect(() => {

    fetch('http://localhost:8000/api/data')

      .then((res) => {

        if (!res.ok) {
          throw new Error('Network response was not ok');
        }

        return res.json();
      })

      .then((data) => {

        console.log('Backend response:', data);

        setBackendMessage(data.message);
      })

      .catch((err) => {

        console.error('Fetch error:', err);

        setBackendMessage('Backend connection failed ❌');
      });

  }, []);


// ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {

    localStorage.removeItem('access_token');

    navigate('/login');

  };

  // ==========================================
  // CUSTOM NODE TYPE
  // ==========================================

  const nodeTypes = useMemo(
    () => ({
      custom: CustomNode,
    }),
    []
  );

  // ==========================================
  // INITIAL NODES
  // ==========================================

  const initialNodes = [
    {
      id: '1',
      type: 'custom',
      position: {
        x: 250,
        y: 150,
      },
      data: {
        label: `Status: ${backendMessage}`,
      },
    },
  ];

  const initialEdges = [];

  // ==========================================
  // REACT FLOW STATE
  // ==========================================

  const [
    nodes,
    setNodes,
    onNodesChange,
  ] = useNodesState(initialNodes);

  const [
    edges,
    setEdges,
    onEdgesChange,
  ] = useEdgesState(initialEdges);

  const selectedNode = nodes.find(
  (node) => node.id === selectedNodeId
);

const selectedNodeConfig =
  selectedNode?.data?.defaultConfig || {};

  // ==========================================
  // UPDATE FIRST NODE WITH BACKEND STATUS
  // ==========================================

  useEffect(() => {

    setNodes((currentNodes) =>

      currentNodes.map((node) => {

        if (node.id === '1') {

          return {
            ...node,
            data: {
              ...node.data,
              label: `Status: ${backendMessage}`,
            },
          };

        }

        return node;

      })

    );

  }, [backendMessage, setNodes]);

  // ==========================================
  // CONNECT NODES
  // ==========================================

  const onConnect = useCallback(
    (params) => {

      setEdges((currentEdges) =>
        addEdge(params, currentEdges)
      );

    },
    [setEdges]
  );

  // ==========================================
  // DRAG OVER
  // ==========================================

  const onDragOver = useCallback((event) => {

    event.preventDefault();

    event.dataTransfer.dropEffect = 'move';

  }, []);

  // ==========================================
  // DROP NODE ON CANVAS
  // ==========================================

  const onDrop = useCallback(
    (event) => {

      event.preventDefault();

      const type = event.dataTransfer.getData(
        'application/reactflow'
      );

      if (!type) {
        return;
      }

      const position = {
        x: event.clientX - 250,
        y: event.clientY - 150,
      };


      // const newNode = {

      //   id: `${Date.now()}`,

      //   type: 'custom',

      //   position,

      //   data: {
      //     label: `${type} Node`,
      //   },

      // };


const nodeDefaults = {

  Start: {
    icon: '▶️',
    title: 'Start',
    inputs: [],
    outputs: ['output'],
    defaultConfig: {
      nodeName: 'Start',
      description: '',
    },
  },

  'HTTP Request': {
    icon: '🌐',
    title: 'HTTP Request',
    inputs: ['input'],
    outputs: ['output'],
    defaultConfig: {
      nodeName: 'HTTP Request',
      description: '',
      url: '',
      httpMethod: 'GET',
    },
  },


  'File Upload': {
    icon: '📁',
    title: 'File Upload',
    inputs: ['input'],
    outputs: ['output'],
    defaultConfig: {
      nodeName: 'File Upload',
      description: 'Handles document and file uploads',
      allowedExtensions: '.pdf, .png, .csv',
      maxFileSizeMb: '10',
      uploadUrl: '/api/upload',
    },
  },

  'Email': {
    icon: '📧',
    title: 'Email',
    inputs: ['input'],
    outputs: ['output'],
    defaultConfig: {
      nodeName: 'Email',
      description: 'Send execution notification email',
      recipientEmail: 'user@example.com',
      subject: 'Workflow Alert',
      body: 'Workflow execution completed.',
      attachment: '',
    },
  },
  'Slack': {
    icon: '💬',
    title: 'Slack',
    inputs: ['input'],
    outputs: ['output'],
    defaultConfig: {
      nodeName: 'Slack',
      description: 'Post updates to Slack channel',
      channel: '#general',
      message: 'Workflow execution notification.',
    },
  },

  Delay: {
    icon: '⏱️',
    title: 'Delay',
    inputs: ['input'],
    outputs: ['output'],
    defaultConfig: {
      nodeName: 'Delay',
      description: '',
      delayTime: 0,
    },
  },

  'Python Function': {
    icon: '🐍',
    title: 'Python Function',
    inputs: ['input'],
    outputs: ['output'],
    defaultConfig: {
      nodeName: 'Python Function',
      description: '',
      pythonScript: '',
    },
  },

  Condition: {
    icon: '🔀',
    title: 'Condition',
    inputs: ['input'],
    outputs: ['true', 'false'],
    defaultConfig: {
      nodeName: 'Condition',
      description: '',
      conditions: '',
    },
  },

  Logger: {
    icon: '📝',
    title: 'Logger',
    inputs: ['input'],
    outputs: ['output'],
    defaultConfig: {
      nodeName: 'Logger',
      description: '',
    },
  },

  End: {
    icon: '⏹️',
    title: 'End',
    inputs: ['input'],
    outputs: [],
    defaultConfig: {
      nodeName: 'End',
      description: '',
    },
  },

};

const selectedNode = nodeDefaults[type] || {
  icon: '⚙️',
  title: type,
  inputs: ['input'],
  outputs: ['output'],
  defaultConfig: {
    nodeName: type,
    description: '',
  },
};

const newNode = {

  id: `${Date.now()}`,

  type: 'custom',

  position,

  data: {
    label: `${type} Node`,

    icon: selectedNode.icon,

    title: selectedNode.title,

    inputs: selectedNode.inputs,

    outputs: selectedNode.outputs,

    defaultConfig: selectedNode.defaultConfig,
  },

};




      setNodes((currentNodes) => [
        ...currentNodes,
        newNode,
      ]);

    },
    [setNodes]
  );

  // ==========================================
  // DRAG START
  // ==========================================

  const onDragStart = (event, nodeType) => {

    event.dataTransfer.setData(
      'application/reactflow',
      nodeType
    );

    event.dataTransfer.effectAllowed = 'move';

  };

  // ==========================================
  // SAVE WORKFLOW
  // ==========================================

  const saveWorkflow = async () => {

    setSaveMessage('Saving workflow...');

    try {

      const response = await fetch(
        'http://localhost:8000/workflows',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },




          body: JSON.stringify({

            name: workflowName,

            description: workflowDescription,

            workflow_json: {
              nodes: nodes,
              edges: edges,
            },

          }),

        }
      );

      const data = await response.json();

      if (!response.ok) {

        throw new Error(
          data.detail || 'Failed to save workflow'
        );

      }

      console.log(
        'Workflow saved successfully:',
        data
      );

   setWorkflowId(data.id);
   localStorage.setItem('workflow_id', String(data.id));

      setSaveMessage(
        `Workflow saved successfully! ID: ${data.id}`
      );

    } catch (error) {

      console.error(
        'Save workflow error:',
        error
      );

      setSaveMessage(
        `Failed to save workflow: ${error.message}`
      );

    }

  };


// ==========================================
// UPDATE WORKFLOW
// ==========================================

const updateWorkflow = async () => {

  if (!workflowId) {
    setSaveMessage('No workflow selected to update.');
    return;
  }

  setSaveMessage('Updating workflow...');

  try {

    const response = await fetch(
      `http://localhost:8000/workflows/${workflowId}`,
      {
        method: 'PUT',

        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },

        body: JSON.stringify({
          name: workflowName,
          description: workflowDescription,

          workflow_json: {
            nodes: nodes,
            edges: edges,
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {

      throw new Error(
        data.detail || 'Failed to update workflow'
      );

    }

    console.log(
      'Workflow updated successfully:',
      data
    );

    setWorkflowId(data.id);

    localStorage.setItem(
      'workflow_id',
      String(data.id)
    );

    setSaveMessage(
      `Workflow updated successfully! ID: ${data.id}`
    );

  } catch (error) {

    console.error(
      'Update workflow error:',
      error
    );

    setSaveMessage(
      `Failed to update workflow: ${error.message}`
    );

  }
};


// ==========================================
// LOAD WORKFLOW
// ==========================================

const loadWorkflow = async () => {

  if (!loadWorkflowId) {
    setSaveMessage('Please enter a workflow ID to load.');
    return;
  }

  try {

    const response = await fetch(
      `http://localhost:8000/workflows/${loadWorkflowId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {

      throw new Error(
        data.detail || 'Failed to load workflow'
      );

    }

    setWorkflowName(data.name);
    setWorkflowDescription(data.description || '');

    console.log('Loaded workflow data:', data);
    console.log('Loaded nodes:', data.workflow_json?.nodes);

    setWorkflowId(data.id);
    localStorage.setItem('workflow_id', String(data.id));

    setNodes(data.workflow_json?.nodes || []);
    setEdges(data.workflow_json?.edges || []);

    setSaveMessage(
      'Workflow loaded successfully!'
    );

  } catch (error) {

    console.error(
      'Load workflow error:',
      error
    );

    setSaveMessage(
      `Failed to load workflow: ${error.message}`
    );

  }

};

  // ==========================================
  // FLOW PAGE UI
  // ==========================================

  return (

    <div className="h-screen w-full flex flex-col bg-gray-50">

      {/* ======================================
          TOP NAVBAR
      ====================================== */}

      <div className="h-[70px] bg-white border-b border-gray-200 flex items-center justify-between px-6">

        <h1 className="text-xl font-bold text-blue-700">
          Workflow Automation Platform
        </h1>




        <div className="flex items-center gap-3">

          <button
            onClick={saveWorkflow}
            className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Save Workflow
          </button>


          <button
            onClick={updateWorkflow}
            disabled={!workflowId}
            className={`px-5 py-2 text-white rounded-lg transition ${
            workflowId
              ? 'bg-orange-600 hover:bg-orange-700'
              : 'bg-gray-400 cursor-not-allowed'
  }`}
>
  Update Workflow
</button>

         <input
            type="number"
            value={loadWorkflowId}
            onChange={(event) => setLoadWorkflowId(event.target.value)}
            placeholder="Workflow ID"
            className="w-28 px-3 py-2 border border-gray-300 rounded-lg"
          />

         <button
            onClick={loadWorkflow}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-green-700 transition"
          >
           Load Workflow
          </button>

           <Link
            to="/profile"
            className="px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
             Profile
           </Link>

          <button
            onClick={handleLogout}
            className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
             Logout
        </button>


          <Link
            to="/about"
            className="px-5 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition"
          >
            About Page
          </Link>

        </div>

</div>

      {/* ======================================
          WORKFLOW DETAILS
      ====================================== */}

      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4">

        <div>

          <label className="block text-xs font-semibold text-gray-500 mb-1">
            Workflow Name
          </label>

          <input
            type="text"
            value={workflowName}
            onChange={(event) =>
              setWorkflowName(event.target.value)
            }
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-56 outline-none focus:ring-2 focus:ring-blue-500"
          />

        </div>

        <div>

          <label className="block text-xs font-semibold text-gray-500 mb-1">
            Description
          </label>

          <input
            type="text"
            value={workflowDescription}
            onChange={(event) =>
              setWorkflowDescription(event.target.value)
            }
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-80 outline-none focus:ring-2 focus:ring-blue-500"
          />

        </div>

        {saveMessage && (

          <div className="text-sm font-medium text-gray-700 mt-5">
            {saveMessage}
          </div>

        )}

      </div>

      {/* ======================================
          MAIN WORKSPACE
      ====================================== */}

      <div className="flex-1 flex overflow-hidden">

        {/* ====================================
            LEFT SIDEBAR
        ==================================== */}

        <div className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col space-y-3 z-10">

          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Components
          </h2>

{/* {Scrollable container for workflow node components} */}

        <h3 className="text-lg font-semibold mb-4">
        
        </h3>
        <div className="max-h-[500px] overflow-y-auto pr-2">

        
{/* START NODE */}

<div
  className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg cursor-grab font-medium text-indigo-700 hover:bg-indigo-100 transition active:cursor-grabbing"
  onDragStart={(event) =>
    onDragStart(event, 'Start')
  }
  draggable
>
  ▶️ Start Node
</div>


{/* HTTP REQUEST NODE */}

<div
  className="p-3 bg-blue-50 border border-blue-200 rounded-lg cursor-grab font-medium text-blue-700 hover:bg-blue-100 transition active:cursor-grabbing"
  onDragStart={(event) =>
    onDragStart(event, 'HTTP Request')
  }
  draggable
>
  🌐 HTTP Request Node
</div>


{/* DELAY NODE */}

<div
  className="p-3 bg-purple-50 border border-purple-200 rounded-lg cursor-grab font-medium text-purple-700 hover:bg-purple-100 transition active:cursor-grabbing"
  onDragStart={(event) =>
    onDragStart(event, 'Delay')
  }
  draggable
>
  ⏱️ Delay Node
</div>


{/* PYTHON FUNCTION NODE */}

<div
  className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg cursor-grab font-medium text-yellow-700 hover:bg-yellow-100 transition active:cursor-grabbing"
  onDragStart={(event) =>
    onDragStart(event, 'Python Function')
  }
  draggable
>
  🐍 Python Function Node
</div>

{/* CONDITION NODE */}

          <div
            className="p-3 bg-amber-50 border border-amber-200 rounded-lg cursor-grab font-medium text-amber-700 hover:bg-amber-100 transition active:cursor-grabbing"
            onDragStart={(event) =>
              onDragStart(event, 'Condition')
            }
            draggable
          >
            🔀 Condition Node
          </div>


{/* LOGGER NODE */}

<div
  className="p-3 bg-green-50 border border-green-200 rounded-lg cursor-grab font-medium text-green-700 hover:bg-green-100 transition active:cursor-grabbing"
  onDragStart={(event) =>
    onDragStart(event, 'Logger')
  }
  draggable
>
  📝 Logger Node
</div>


{/* END NODE */}

<div
  className="p-3 bg-red-50 border border-red-200 rounded-lg cursor-grab font-medium text-red-700 hover:bg-red-100 transition active:cursor-grabbing"
  onDragStart={(event) =>
    onDragStart(event, 'End')
  }
  draggable
> 
   ⏹️ End Node
</div>

{/* Drag-and-Drop Sidebar Item for File Upload Node */}

<div
  className="p-3 bg-teal-50 border border-teal-200 rounded-lg cursor-grab font-medium text-teal-700 hover:bg-teal-100 transition active:cursor-grabbing"
  onDragStart={(event) =>
    onDragStart(event, 'File Upload')
  }
  draggable
>
  📁 File Upload Node
</div>

{/* EMAIL NODE */}
<div
  className="p-3 bg-blue-50 border border-blue-200 rounded-lg cursor-grab font-medium text-blue-700 hover:bg-blue-100 transition active:cursor-grabbing mb-2"
  onDragStart={(event) =>
    onDragStart(event, 'Email')
  }
  draggable
>
  📧 Email Node
</div>

{/* SLACK NODE */}
<div
  className="p-3 bg-purple-50 border border-purple-200 rounded-lg cursor-grab font-medium text-purple-700 hover:bg-purple-100 transition active:cursor-grabbing mb-2"
  onDragStart={(event) =>
    onDragStart(event, 'Slack')
  }
  draggable
>
  💬 Slack Node
</div>


 </div>

</div>



 
        {/* ====================================
            REACT FLOW CANVAS
        ==================================== */}

        <div className="flex-1 h-full relative">

            {/* Floating Action Controls */}
<div className="absolute top-4 right-4 z-10 flex gap-2 bg-white/90 p-2 rounded-lg shadow-md border border-gray-200 backdrop-blur-sm">
  <button 
    onClick={handleExport} 
    className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 font-medium transition-colors"
  >
    Export JSON
  </button>

  <label className="px-3 py-1.5 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 cursor-pointer font-medium transition-colors">
    Import JSON
    <input 
      type="file" 
      accept=".json" 
      onChange={handleImport} 
      className="hidden" 
    />
  </label>

</div>



          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onNodeClick={(event, node) => 
              setSelectedNodeId(node.id)
            }
            onDrop={onDrop}
            onDragOver={onDragOver}
            edgesDeletable={true}
            nodesDeletable={true}
            deleteKeyCode={['Backspace', 'Delete']}
            fitView
          >

            <Background
              color="#aaa"
              gap={20}
              size={1}
            />

            <Controls />

            <MiniMap
              nodeStrokeWidth={3}
              zoomable
              pannable
            />

          </ReactFlow>



{selectedNode && (
  <div className="fixed top-24 right-6 w-80 bg-white border-2 border-blue-500 rounded-xl shadow-2xl p-5 z-50 max-h-[80vh] overflow-y-auto">


<div className="flex items-center justify-between mb-4">

  <h2 className="text-lg font-bold text-gray-800">
    Node Configuration
  </h2>

  <button
    type="button"
    onClick={() => setSelectedNodeId(null)}
    className="text-gray-500 hover:text-red-600 text-2xl font-bold leading-none"
  >
    ×
  </button>

</div>


    {/* NODE NAME */}

    <label className="block text-sm font-semibold text-gray-700 mb-1">
      Node Name
    </label>

    <input
      type="text"
      value={selectedNodeConfig.nodeName || ''}
      onChange={(e) => {
        setNodes((currentNodes) =>
          currentNodes.map((node) =>
            node.id === selectedNodeId
              ? {
                  ...node,
                  data: {
                    ...node.data,
                    defaultConfig: {
                      ...node.data.defaultConfig,
                      nodeName: e.target.value,
                    },
                  },
                }
              : node
          )
        );
      }}
      className="w-full border border-gray-300 rounded-lg p-2 mb-4"
    />

    {/* DESCRIPTION */}

    <label className="block text-sm font-semibold text-gray-700 mb-1">
      Description
    </label>

    <textarea
      value={selectedNodeConfig.description || ''}
      onChange={(e) => {
        setNodes((currentNodes) =>
          currentNodes.map((node) =>
            node.id === selectedNodeId
              ? {
                  ...node,
                  data: {
                    ...node.data,
                    defaultConfig: {
                      ...node.data.defaultConfig,
                      description: e.target.value,
                    },
                  },
                }
              : node
          )
        );
      }}
      className="w-full border border-gray-300 rounded-lg p-2 mb-4"
    />

    {/* HTTP REQUEST */}

    {selectedNode.data?.title === 'HTTP Request' && (
      <>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          URL
        </label>

        <input
          type="text"
          value={selectedNodeConfig.url || ''}
          onChange={(e) => {
            setNodes((currentNodes) =>
              currentNodes.map((node) =>
                node.id === selectedNodeId
                  ? {
                      ...node,
                      data: {
                        ...node.data,
                        defaultConfig: {
                          ...node.data.defaultConfig,
                          url: e.target.value,
                        },
                      },
                    }
                  : node
              )
            );
          }}
          className="w-full border border-gray-300 rounded-lg p-2 mb-4"
        />

        <label className="block text-sm font-semibold text-gray-700 mb-1">
          HTTP Method
        </label>

        <select
          value={selectedNodeConfig.httpMethod || 'GET'}
          onChange={(e) => {
            setNodes((currentNodes) =>
              currentNodes.map((node) =>
                node.id === selectedNodeId
                  ? {
                      ...node,
                      data: {
                        ...node.data,
                        defaultConfig: {
                          ...node.data.defaultConfig,
                          httpMethod: e.target.value,
                        },
                      },
                    }
                  : node
              )
            );
          }}
          className="w-full border border-gray-300 rounded-lg p-2 mb-4"
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>
      </>
    )}

    {/* FILE UPLOAD NODE CONFIGURATION */}
{selectedNode.data?.title === 'File Upload' && (
  <>
    {/* Allowed File Extensions Input */}
    <label className="block text-sm font-semibold text-gray-700 mb-1">
      Allowed File Extensions
    </label>
    <input
      type="text"
      placeholder=".pdf, .png, .csv, .json"
      value={selectedNodeConfig.allowedExtensions || ''}
      onChange={(e) => {
        setNodes((currentNodes) =>
          currentNodes.map((node) =>
            node.id === selectedNodeId
              ? {
                  ...node,
                  data: {
                    ...node.data,
                    defaultConfig: {
                      ...node.data.defaultConfig,
                      allowedExtensions: e.target.value,
                    },
                  },
                }
              : node
          )
        );
      }}
      className="w-full border border-gray-300 rounded-lg p-2 mb-4"
    />

    {/* Max File Size Input (MB) */}
    <label className="block text-sm font-semibold text-gray-700 mb-1">
      Max File Size (MB)
    </label>
    <input
      type="number"
      placeholder="10"
      value={selectedNodeConfig.maxFileSizeMb || ''}
      onChange={(e) => {
        setNodes((currentNodes) =>
          currentNodes.map((node) =>
            node.id === selectedNodeId
              ? {
                  ...node,
                  data: {
                    ...node.data,
                    defaultConfig: {
                      ...node.data.defaultConfig,
                      maxFileSizeMb: e.target.value,
                    },
                  },
                }
              : node
          )
        );
      }}
      className="w-full border border-gray-300 rounded-lg p-2 mb-4"
    />

    {/* Upload Target URL Input */}
    <label className="block text-sm font-semibold text-gray-700 mb-1">
      Upload Target URL
    </label>
    <input
      type="text"
      placeholder="https://api.example.com/upload"
      value={selectedNodeConfig.uploadUrl || ''}
      onChange={(e) => {
        setNodes((currentNodes) =>
          currentNodes.map((node) =>
            node.id === selectedNodeId
              ? {
                  ...node,
                  data: {
                    ...node.data,
                    defaultConfig: {
                      ...node.data.defaultConfig,
                      uploadUrl: e.target.value,
                    },
                  },
                }
              : node
          )
        );
      }}
      className="w-full border border-gray-300 rounded-lg p-2 mb-4"
    />

    {/* Upload File (Test Input) */}
    <label className="block text-sm font-semibold text-gray-700 mb-1">
      Upload File (Test)
    </label>
    <input
      type="file"
      onChange={(e) => {
        const file = e.target.files[0];
        if (file) {
          const maxMb = parseFloat(selectedNodeConfig.maxFileSizeMb) || 10;
          const fileSizeMb = file.size / (1024 * 1024);

          if (fileSizeMb > maxMb) {
            alert(`File size exceeds the limit of ${maxMb} MB!`);
            e.target.value = '';
            return;
          }

          alert(`Selected File: ${file.name} (${fileSizeMb.toFixed(2)} MB)`);

          setNodes((currentNodes) =>
            currentNodes.map((node) =>
              node.id === selectedNodeId
                ? {
                    ...node,
                    data: {
                      ...node.data,
                      defaultConfig: {
                        ...node.data.defaultConfig,
                        uploadedFileName: file.name,
                      },
                    },
                  }
                : node
            )
          );
        }
      }}
      className="w-full border border-gray-300 rounded-lg p-2 mb-4 text-sm text-gray-700 bg-white cursor-pointer"
    />


  </>
)}


  {/* EMAIL NODE */}
  {selectedNode.data?.title === 'Email' && (
    <>
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        Recipient Email
      </label>
      <input
        type="email"
        value={selectedNodeConfig.recipientEmail ?? ''}
        onChange={(e) => {
          setNodes((currentNodes) =>
            currentNodes.map((node) =>
              node.id === selectedNodeId
                ? {
                    ...node,
                    data: {
                      ...node.data,
                      defaultConfig: {
                        ...node.data.defaultConfig,
                        recipientEmail: e.target.value,
                      },
                    },
                  }
                : node
            )
          );
        }}
        className="w-full border border-gray-300 rounded-lg p-2 mb-4"
      />

      <label className="block text-sm font-semibold text-gray-700 mb-1">
        Subject
      </label>
      <input
        type="text"
        value={selectedNodeConfig.subject ?? ''}
        onChange={(e) => {
          setNodes((currentNodes) =>
            currentNodes.map((node) =>
              node.id === selectedNodeId
                ? {
                    ...node,
                    data: {
                      ...node.data,
                      defaultConfig: {
                        ...node.data.defaultConfig,
                        subject: e.target.value,
                      },
                    },
                  }
                : node
            )
          );
        }}
        className="w-full border border-gray-300 rounded-lg p-2 mb-4"
      />

  <label className="block text-sm font-semibold text-gray-700 mb-1">
      Body / Message
    </label>
    <textarea
      rows={4}
      value={selectedNodeConfig.body ?? ''}
      onChange={(e) => {
        setNodes((currentNodes) =>
          currentNodes.map((node) =>
            node.id === selectedNodeId
              ? {
                  ...node,
                  data: {
                    ...node.data,
                    defaultConfig: {
                      ...node.data.defaultConfig,
                      body: e.target.value,
                    },
                  },
                }
              : node
          )
        );
      }}
      className="w-full border border-gray-300 rounded-lg p-2 mb-4"
    />

        {/* EMAIL NODE */}
    {selectedNode.data?.title === 'Email' && (
      <>
        {/* Existing fields: Recipient Email, Subject, Body, Attachment */}
        
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Attachment (File Path / Variable)
        </label>
        <input
          type="text"
          placeholder="/path/to/file.pdf or {{previous_node.file}}"
          value={selectedNodeConfig.attachment ?? ''}
          onChange={(e) => {
            setNodes((currentNodes) =>
              currentNodes.map((node) =>
                node.id === selectedNodeId
                  ? {
                      ...node,
                      data: {
                        ...node.data,
                        defaultConfig: {
                          ...node.data.defaultConfig,
                          attachment: e.target.value,
                        },
                      },
                    }
                  : node
              )
            );
          }}
          className="w-full border border-gray-300 rounded-lg p-2 mb-4"
        />
      </>
    )}


  </>
  )}
     

  {/* SLACK NODE */}
  {selectedNode.data?.title === 'Slack' && (
    <>
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        Channel
      </label>
      <input
        type="text"
        value={selectedNodeConfig.channel ?? ''}
        onChange={(e) => {
          setNodes((currentNodes) =>
            currentNodes.map((node) =>
              node.id === selectedNodeId
                ? {
                    ...node,
                    data: {
                      ...node.data,
                      defaultConfig: {
                        ...node.data.defaultConfig,
                        channel: e.target.value,
                      },
                    },
                  }
                : node
            )
          );
        }}
        className="w-full border border-gray-300 rounded-lg p-2 mb-4"
      />

      <label className="block text-sm font-semibold text-gray-700 mb-1">
        Message
      </label>
      <textarea
        value={selectedNodeConfig.message ?? ''}
        onChange={(e) => {
          setNodes((currentNodes) =>
            currentNodes.map((node) =>
              node.id === selectedNodeId
                ? {
                    ...node,
                    data: {
                      ...node.data,
                      defaultConfig: {
                        ...node.data.defaultConfig,
                        message: e.target.value,
                      },
                    },
                  }
                : node
            )
          );
        }}
        className="w-full border border-gray-300 rounded-lg p-2 mb-4"
      />
    </>
  )}


    {/* DELAY */}

    {selectedNode.data?.title === 'Delay' && (
      <>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Delay Time
        </label>

        <input
          type="number"
          value={selectedNodeConfig.delayTime ?? 0}
          onChange={(e) => {
            setNodes((currentNodes) =>
              currentNodes.map((node) =>
                node.id === selectedNodeId
                  ? {
                      ...node,
                      data: {
                        ...node.data,
                        defaultConfig: {
                          ...node.data.defaultConfig,
                          delayTime: Number(e.target.value),
                        },
                      },
                    }
                  : node
              )
            );
          }}
          className="w-full border border-gray-300 rounded-lg p-2 mb-4"
        />
      </>
    )}

    {/* PYTHON FUNCTION */}

    {selectedNode.data?.title === 'Python Function' && (
      <>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Python Script
        </label>

        <textarea
          value={selectedNodeConfig.pythonScript || ''}
          onChange={(e) => {
            setNodes((currentNodes) =>
              currentNodes.map((node) =>
                node.id === selectedNodeId
                  ? {
                      ...node,
                      data: {
                        ...node.data,
                        defaultConfig: {
                          ...node.data.defaultConfig,
                          pythonScript: e.target.value,
                        },
                      },
                    }
                  : node
              )
            );
          }}
          className="w-full border border-gray-300 rounded-lg p-2 mb-4"
          rows="5"
        />
      </>
    )}

    {/* CONDITION */}

    {selectedNode.data?.title === 'Condition' && (
      <>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Conditions
        </label>

        <textarea
          value={selectedNodeConfig.conditions || ''}
          onChange={(e) => {
            setNodes((currentNodes) =>
              currentNodes.map((node) =>
                node.id === selectedNodeId
                  ? {
                      ...node,
                      data: {
                        ...node.data,
                        defaultConfig: {
                          ...node.data.defaultConfig,
                          conditions: e.target.value,
                        },
                      },
                    }
                  : node
              )
            );
          }}
          className="w-full border border-gray-300 rounded-lg p-2 mb-4"
        />
      </>
    )}


  </div>
)}

        </div>
        

      </div>

    </div>

  );

};

// ==========================================
// 2. ABOUT PAGE
// ==========================================

const AboutPage = () => {

  return (

    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* NAVBAR */}

      <div className="h-[70px] bg-white border-b border-gray-200 flex items-center justify-between px-6">

        <h1 className="text-xl font-bold text-blue-700">
          Workflow Automation Platform
        </h1>

        <Link
          to="/canvas"
          className="px-5 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition"
        >
          ← Back to Canvas
        </Link>

      </div>

      {/* ABOUT CONTENT */}

      <div className="flex-1 flex items-center justify-center p-6">

        <div className="max-w-2xl bg-white rounded-xl shadow-md p-8">

          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            About This Project
          </h2>

          <p className="text-gray-600 leading-7 mb-4">

            This is a full-stack workflow automation application
            built using React, React Flow, FastAPI and PostgreSQL.

          </p>

          <p className="text-gray-600 leading-7">

            The application allows users to create and manage
            visual workflow nodes and connect them together
            using the React Flow editor.

          </p>

        </div>

      </div>

    </div>

  );

};

// ==========================================
// 3. MAIN APP
// ==========================================

function App() {

  return (

    <Router>    

      <Routes>

        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        <Route
          path="/login"
          element={<LoginPage />}
        />

      <Route
          path="/register"
          element={<RegisterPage />}
        />


        <Route
          path="/profile"
          element={<ProfilePage />}
        />



        <Route
          path="/canvas"
          element={<FlowPage />}
        />

        <Route
          path="/about"
          element={<AboutPage />}
        />

      </Routes>

    </Router>

  );

}

export default App;