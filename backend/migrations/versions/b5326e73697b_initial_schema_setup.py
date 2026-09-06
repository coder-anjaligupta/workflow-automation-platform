"""Initial schema setup

Revision ID: b5326e73697b
Revises:
Create Date: 2026-08-01 02:28:37.097413
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "b5326e73697b"
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Create initial database tables."""

    # Users table
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("email", sa.String(), nullable=False),
        sa.Column("password", sa.String(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_index(
        "ix_users_id",
        "users",
        ["id"],
        unique=False
    )

    op.create_index(
        "ix_users_email",
        "users",
        ["email"],
        unique=True
    )

    # Workflows table
    op.create_table(
        "workflows",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("workflow_json", sa.JSON(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=True
        ),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_index(
        "ix_workflows_id",
        "workflows",
        ["id"],
        unique=False
    )

    # Executions table
    op.create_table(
        "executions",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("workflow_id", sa.Integer(), nullable=False),
        sa.Column("status", sa.String(), nullable=False),
        sa.Column("logs", sa.Text(), nullable=True),
        sa.Column("output", sa.JSON(), nullable=True),
        sa.Column(
            "started_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=True
        ),
        sa.Column("finished_at", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(
            ["workflow_id"],
            ["workflows.id"]
        ),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_index(
        "ix_executions_id",
        "executions",
        ["id"],
        unique=False
    )


def downgrade() -> None:
    """Remove initial database tables."""

    op.drop_index(
        "ix_executions_id",
        table_name="executions"
    )
    op.drop_table("executions")

    op.drop_index(
        "ix_workflows_id",
        table_name="workflows"
    )
    op.drop_table("workflows")

    op.drop_index(
        "ix_users_email",
        table_name="users"
    )
    op.drop_index(
        "ix_users_id",
        table_name="users"
    )
    op.drop_table("users")