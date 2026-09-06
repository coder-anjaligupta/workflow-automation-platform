
# ==========================================
# PHASE 10 + PHASE 12
# WORKFLOW EXECUTION ENGINE
# ==========================================


import requests


def find_start_node(workflow_json):
    """
    Find the Start node from the workflow JSON.
    """

    nodes = workflow_json.get("nodes", [])

    for node in nodes:
        node_title = node.get("data", {}).get("title")

        if node_title == "Start":
            return node

    return None


def get_next_node(workflow_json, current_node_id):
    """
    Find the next node connected to the current node.
    """

    nodes = workflow_json.get("nodes", [])
    edges = workflow_json.get("edges", [])

    for edge in edges:

        if edge.get("source") == current_node_id:

            next_node_id = edge.get("target")

            for node in nodes:

                if node.get("id") == next_node_id:
                    return node

    return None


def get_execution_order(workflow_json):
    """
    Determine the execution order of workflow nodes
    and validate workflow connections.
    """

    if not workflow_json:
        raise ValueError(
            "Missing workflow configuration"
        )

    nodes = workflow_json.get("nodes", [])
    edges = workflow_json.get("edges", [])

    # Create a set of valid node IDs
    node_ids = {
        node.get("id")
        for node in nodes
    }

    # ------------------------------------------
    # Validate workflow connections
    # ------------------------------------------

    for edge in edges:

        source = edge.get("source")
        target = edge.get("target")

        if source not in node_ids:
            raise ValueError(
                f"Invalid connection: source node '{source}' not found"
            )

        if target not in node_ids:
            raise ValueError(
                f"Invalid connection: target node '{target}' not found"
            )

    # ------------------------------------------
    # Find Start node
    # ------------------------------------------

    start_node = find_start_node(workflow_json)

    if start_node is None:
        raise ValueError("Start node not found")

    execution_order = []

    current_node = start_node

    visited_nodes = set()

    # ------------------------------------------
    # Determine execution order
    # ------------------------------------------

    while current_node is not None:

        current_node_id = current_node.get("id")

        # Detect infinite loop
        if current_node_id in visited_nodes:
            raise ValueError(
                "Infinite loop detected in workflow"
            )

        visited_nodes.add(current_node_id)

        execution_order.append(current_node)

        # Stop when End node is reached
        if current_node.get("data", {}).get("title") == "End":
            break

        current_node = get_next_node(
            workflow_json,
            current_node_id
        )

    # ------------------------------------------
    # Validate execution order
    # ------------------------------------------

    if not execution_order:
        raise ValueError(
            "Workflow execution order is empty"
        )

    last_node = execution_order[-1]

    if last_node.get("data", {}).get("title") != "End":
        raise ValueError(
            "Workflow does not reach an End node"
        )

    return execution_order


def execute_node(node, input_data=None):
    """
    Execute a single workflow node.
    Includes Phase 12 error handling
    for missing configuration.
    """

    node_title = node.get("data", {}).get("title")
    config = node.get("data", {}).get("defaultConfig", {})

    # ------------------------------------------
    # Validate node title
    # ------------------------------------------

    if not node_title:
        raise ValueError(
            "Missing configuration: node title is required"
        )

    # ------------------------------------------
    # Start
    # ------------------------------------------

    if node_title == "Start":

        return {
            "status": "success",
            "message": "Workflow started",
            "data": {
                "message": "Workflow started successfully"
            }
        }



    # ------------------------------------------
    # HTTP Request
    # ------------------------------------------

    if node_title == "HTTP Request":

        url = config.get("url")

        if not url:
            raise ValueError(
                "Missing configuration: HTTP Request URL is required"
            )

        http_method = config.get(
            "httpMethod",
            "GET"
        ).upper()

        try:

            response = requests.request(
                method=http_method,
                url=url,
                timeout=10
            )

            response.raise_for_status()

        except requests.exceptions.RequestException as e:

            raise RuntimeError(
                f"HTTP Request failed: {str(e)}"
            )

        return {
            "status": "success",
            "message": "HTTP Request executed",
            "data": {
                "previous_data": input_data,
                "url": url,
                "method": http_method,
                "status_code": response.status_code,
                "response": response.text,
                "message": "HTTP Request executed successfully"
            }
        }
    


    # ------------------------------------------
    # Delay
    # ------------------------------------------

    if node_title == "Delay":

        delay_time = config.get("delayTime")

        if delay_time is None:
            raise ValueError(
                "Missing configuration: Delay time is required"
            )

        if delay_time < 0:
            raise ValueError(
                "Invalid configuration: Delay time cannot be negative"
            )

        return {
            "status": "success",
            "message": "Delay executed",
            "data": {
                "previous_data": input_data,
                "delay_time": delay_time,
                "message": "Delay completed"
            }
        }

    # ------------------------------------------
    # Python Function
    # ------------------------------------------

    if node_title == "Python Function":

        python_script = config.get("pythonScript")

        if not python_script:
            raise ValueError(
                "Missing configuration: Python script is required"
            )

        try:

            exec(
                python_script,
                {
                    "__builtins__": __builtins__
                },
                {
                    "input_data": input_data
                }
            )

        except Exception as e:

            raise RuntimeError(
                f"Python execution failed: {str(e)}"
            )

        return {
            "status": "success",
            "message": "Python Function executed",
            "data": {
                "previous_data": input_data,
                "message": "Python Function executed successfully"
            }
        }


    # -----------------------------------------
    # Condition
    # ------------------------------------------

    if node_title == "Condition":

        conditions = config.get("conditions")

        if not conditions:
            raise ValueError(
                "Missing configuration: Condition is required"
            )

        return {
            "status": "success",
            "message": "Condition executed",
            "data": {
                "previous_data": input_data,
                "condition_result": True
            }
        }

    # ------------------------------------------
    # Logger
    # ------------------------------------------

    if node_title == "Logger":

        return {
            "status": "success",
            "message": "Logger executed",
            "data": {
                "previous_data": input_data,
                "message": "Logger received the data"
            }
        }

    # ------------------------------------------
    # End
    # ------------------------------------------

    if node_title == "End":

        return {
            "status": "success",
            "message": "Workflow completed",
            "data": input_data
        }

    # ------------------------------------------
    # Unknown node
    # ------------------------------------------

    raise ValueError(
        f"Unsupported workflow node: {node_title}"
    )





def execute_workflow(workflow_json):
    """
    Execute workflow nodes sequentially
    from Start to End.

    Phase 12:
    - Handle execution errors
    - Preserve existing Phase 10 output structure
    """

    execution_order = get_execution_order(workflow_json)
      

    input_data = None
    logs = []

    try:

        for node in execution_order:

            result = execute_node(
                node,
                input_data
            )

            logs.append(result["message"])

            input_data = result["data"]

            print(
                f"Executed: {node.get('data', {}).get('title')}"
            )

            if node.get("data", {}).get("title") == "End":
                break

        return {
            "status": "success",
            "logs": logs,
            "output": input_data
        }

    except Exception as e:

        print(
            f"Workflow execution failed: {str(e)}"
        )

        raise





# ==========================================
# TEST WORKFLOW
# ==========================================

if __name__ == "__main__":

    test_workflow = {

        "nodes": [

            {
                "id": "1",
                "data": {
                    "title": "Start"
                }
            },

            {
                "id": "2",
                "data": {
                    "title": "HTTP Request"
                }
            },

            {
                "id": "3",
                "data": {
                    "title": "Logger"
                }
            },

            {
                "id": "4",
                "data": {
                    "title": "End"
                }
            }

        ],

        "edges": [

            {
                "source": "1",
                "target": "2"
            },

            {
                "source": "2",
                "target": "3"
            },

            {
                "source": "3",
                "target": "4"
            }

        ]

    }

    print("Execution Order:")

    order = get_execution_order(test_workflow)

    for node in order:
        print(
            node["data"]["title"]
        )

    print("\nExecuting Workflow:")

    result = execute_workflow(
        test_workflow
    )

    print("\nExecution Result:")

    print(result)