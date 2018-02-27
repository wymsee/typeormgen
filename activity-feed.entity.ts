import { Column, Entity } from 'typeorm';
import * as joi from 'joi';

@Entity('activity_feed')
export default class ActivityFeed extends Base {
	@PrimaryGeneratedColumn()
	id: number;

	@Column('int')
	prod_id: number;

	@Column('int')
	created_by: number;

	@Column('')
	message: string;

	@Column('')
	updated_table: string;

	@Column('int')
	updated_id: number;

	@Column('')
	date_created: string;

	static rules() {
		return {
			id: joi.string();
			prod_id: joi.string();
			created_by: joi.string();
			message: joi.string();
			updated_table: joi.string();
			updated_id: joi.string();
			date_created: joi.string();
		};
	}

	constructor(props?: Partial<ActivityFeed>) {
		super(props);
	}
}

