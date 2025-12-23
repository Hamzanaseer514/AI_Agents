"""
Agent Registry - Central registry for all AI agents
This allows easy access and management of all agents
"""

from typing import Dict, Type
from .base_agent import BaseAgent


class AgentRegistry:
    """
    Registry for managing all AI agents.
    Provides a centralized way to access and instantiate agents.
    """
    
    _agents: Dict[str, Type[BaseAgent]] = {}
    
    @classmethod
    def register(cls, agent_name: str, agent_class: Type[BaseAgent]):
        """
        Register an agent class.
        
        Args:
            agent_name (str): Name identifier for the agent
            agent_class (Type[BaseAgent]): Agent class to register
        """
        cls._agents[agent_name] = agent_class
    
    @classmethod
    def get_agent(cls, agent_name: str) -> BaseAgent:
        """
        Get an instance of a registered agent.
        
        Args:
            agent_name (str): Name of the agent to get
            
        Returns:
            BaseAgent: Instance of the agent
            
        Raises:
            KeyError: If agent is not registered
        """
        if agent_name not in cls._agents:
            raise KeyError(f"Agent '{agent_name}' is not registered")
        
        return cls._agents[agent_name]()
    
    @classmethod
    def list_agents(cls) -> list:
        """
        Get list of all registered agent names.
        
        Returns:
            list: List of agent names
        """
        return list(cls._agents.keys())
    
    @classmethod
    def is_registered(cls, agent_name: str) -> bool:
        """
        Check if an agent is registered.
        
        Args:
            agent_name (str): Name of the agent to check
            
        Returns:
            bool: True if registered, False otherwise
        """
        return agent_name in cls._agents

