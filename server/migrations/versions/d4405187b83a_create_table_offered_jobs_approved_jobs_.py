"""Create table offered jobs, approved jobs, complete jobs, bids

Revision ID: d4405187b83a
Revises: 1a5f260c4b3c
Create Date: 2024-02-02 22:51:15.308741

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'd4405187b83a'
down_revision = '1a5f260c4b3c'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('offered_jobs',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('title', sa.String(length=255), nullable=True),
    sa.Column('wage', sa.Float(), nullable=True),
    sa.Column('hours', sa.Integer(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('workers',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('first_name', sa.String(), nullable=True),
    sa.Column('last_name', sa.String(), nullable=True),
    sa.Column('phone', sa.String(), nullable=True),
    sa.Column('email', sa.String(), nullable=True),
    sa.Column('location', sa.String(), nullable=True),
    sa.Column('title', sa.String(), nullable=True),
    sa.Column('password', sa.String(), nullable=True),
    sa.Column('about', sa.String(), nullable=True),
    sa.Column('image', sa.String(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('approved_jobs',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('amount', sa.Integer(), nullable=True),
    sa.Column('hours', sa.Integer(), nullable=True),
    sa.Column('progress', sa.Integer(), nullable=True),
    sa.Column('worker_id', sa.Integer(), nullable=False),
    sa.Column('offered_job_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['offered_job_id'], ['offered_jobs.id'], ),
    sa.ForeignKeyConstraint(['worker_id'], ['workers.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('offered_job_id')
    )
    op.create_table('bids',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('amount', sa.Float(), nullable=True),
    sa.Column('worker_id', sa.Integer(), nullable=False),
    sa.Column('offered_job_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['offered_job_id'], ['offered_jobs.id'], ),
    sa.ForeignKeyConstraint(['worker_id'], ['workers.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('completed_jobs',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('paid', sa.Boolean(), nullable=True),
    sa.Column('rating', sa.Integer(), nullable=True),
    sa.Column('certificate', sa.Integer(), nullable=True),
    sa.Column('approved_job_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['approved_job_id'], ['approved_jobs.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('approved_job_id')
    )
    op.drop_table('users')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('users',
    sa.Column('id', sa.INTEGER(), nullable=False),
    sa.Column('first_name', sa.VARCHAR(), nullable=True),
    sa.Column('last_name', sa.VARCHAR(), nullable=True),
    sa.Column('phone', sa.VARCHAR(), nullable=True),
    sa.Column('email', sa.VARCHAR(), nullable=True),
    sa.Column('location', sa.VARCHAR(), nullable=True),
    sa.Column('title', sa.VARCHAR(), nullable=True),
    sa.Column('password', sa.VARCHAR(), nullable=True),
    sa.Column('about', sa.VARCHAR(), nullable=True),
    sa.Column('image', sa.VARCHAR(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.drop_table('completed_jobs')
    op.drop_table('bids')
    op.drop_table('approved_jobs')
    op.drop_table('workers')
    op.drop_table('offered_jobs')
    # ### end Alembic commands ###
