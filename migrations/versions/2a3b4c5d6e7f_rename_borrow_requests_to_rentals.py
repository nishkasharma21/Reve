from alembic import op
import sqlalchemy as sa

revision = '2a3b4c5d6e7f'
down_revision = '1ef9f240d731'
branch_labels = None
depends_on = None

def upgrade():
    # Rename table
    op.rename_table('borrow_requests', 'rentals')
    
    # Add new columns
    op.add_column('rentals', sa.Column('owner_id', sa.Integer(), nullable=True))
    op.add_column('rentals', sa.Column('pickup_code', sa.String(length=4), nullable=True))
    op.add_column('rentals', sa.Column('return_code', sa.String(length=4), nullable=True))
    
    # Add foreign key for owner_id
    op.create_foreign_key('fk_rentals_owner_id', 'rentals', 'users', ['owner_id'], ['id'])

def downgrade():
    op.drop_constraint('fk_rentals_owner_id', 'rentals', type_='foreignkey')
    op.drop_column('rentals', 'owner_id')
    op.drop_column('rentals', 'pickup_code')
    op.drop_column('rentals', 'return_code')
    op.rename_table('rentals', 'borrow_requests')