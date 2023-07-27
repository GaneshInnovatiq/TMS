import { Pagination } from './pagination.model';

export interface MainCategory {
	subCategories: any;
	_id: string;
	category_name: string;
	createdAt: string;
	updatedAt: string;
	__v: number;
	id: string;

}

export interface Certificate {
	course: string;
	createdAt: string;
	id: string;
	image:string;
	isDeleted:boolean;
	name:string;
	passStatus: string;
	title: string;
	updatedAt: string;
	_id: string;
}


export interface SubCategory {
	_id: string;
	main_category_id: string;
	category_name: string;
	createdAt: string;
	updatedAt: string;
	__v: number;
	id: string;
}

export interface CourseModel {
  category_name: string ;
	status: string;
	slug: string;
	_id: string;
	title: string;
	courseCode: string;
	course_duration_in_days: number;
	training_hours: number;
	skill_connect_code: string;
	fee: number;
	currency_code: number;
	main_category: string;
	//   main_category_id: string;
	sub_category: string;
	mainCategory:string;
	main_category_text: string|undefined;
	sub_category_text: string|undefined;
	pdu_technical: number;
	pdu_leadership: number;
	pdu_strategic: number;
	website_link: string;
	image_link: string;
	funding_grant: string;
	survey: string;
	course_kit: CourseKit;
	certificates: number;
	course_description: string;
	course_detailed_description: string;
	banner_image_link: string;
	course_instructor: string;
	createdAt: string;
	updatedAt: string;
	__v: number;
	id: string;
}
export interface Instructor {
	_id: string;
	user_id: User_id;
	linkedin: string;
	about: string;
	experience: string;
	website: string;
	createdAt: string;
	updatedAt: string;
	__v: number;
	id: string;
}
export interface CourseUploadData {
   title?: string;
  courseCode?: string;
  main_category?: string;
  sub_category?: string;
  course_duration_in_days?: number;
  training_hours?: number;
  fee?: number;
  currency_code: number;
  skill_connect_code?: string;
  course_description?: string;
  course_detailed_description?: string;
  pdu_technical?: number;
  pdu_leadership?: number;
  pdu_strategic?: number;
  funding_grant?: string[];
  survey?: string[];
  course_instructor?: string[];
  course_kit?: string[];
}

export interface CourseEditModel {
	status: string;
	slug: string;
	_id: string;
	title: string;
	courseCode: string;
	course_duration_in_days: number;
	training_hours: number;
	skill_connect_code: string;
	fee: number;
	currency_code: number;
	main_category: MainCategory;
	sub_category: SubCategory;
	main_category_text: string;
	sub_category_text: string;
	pdu_technical: number;
	pdu_leadership: number;
	pdu_strategic: number;
	website_link: string;
	image_link: string;
	funding_grant: FundingGrant;
	survey: Survey;
	certificates: number;
	course_description: string;
	course_detailed_description: string;
	course_kit: CourseKit;
	banner_image_link: string;
	createdAt: string;
	updatedAt: string;
	course_instructor: Instructor;
	__v: number;
	id: string;
}

export interface CoursePaginationModel extends Pagination {
	docs: CourseModel[];
	main_category: string|undefined;
	sub_category: string|undefined;
	filterText: string;
	sortBy: string;
	sortByDirection: string;
	status: string;
}


export interface FundingGrant {
	_id: string;
	grant_type: string;
	createdAt: string;
	updatedAt: string;
	__v: number;
	id: string;
}

export interface Survey {
	_id: string;
	name: string;
	createdAt: string;
	updatedAt: string;
	__v: number;
	id: string;
}

export interface CourseKitModel extends Pagination {
  status: string;
	data: CourseKit[];
	totalCount: number;
	filterText: string;
	limit: number;
	sortBy: string;
	sortByDirection: string
}

export interface CourseKit {
	_id: string;
	name: string;
	docs: CourseKit[];
	shortDescription: string;
	longDescription: string;
	videoLink: string;
	documentLink: string;
	createdAt: string;
	updatedAt: string;
	__v: number;
	id: string;
}
export interface AllbannerImage {
	active: boolean;
	_id: string;
}

export interface Geography {
	citizenship: string;
	timezone: string;
	country: number;
	city: number;
	state: number;
	is_completed: boolean;
}

export interface History {
	education: any[];
}

export interface Grade {
	field_of_study: string[];
	score: string[];
	_id: string;
	name: number;
	board: string;
	scoreType: string;
	tbd: boolean;
	start_year: number;
	end_year: number;
}

export interface Education {
	grade_choosen: string[];
	year_choosen: any[];
	_id: string;
	type: string;
	name: string;
	locationCity: string;
	locationState: string;
	locationCountry: string;
	grade: Grade[];
	collegegrade: any[];
}

export interface History_updated {
	education: Education[];
	is_completed: boolean;
}

export interface Interest {
	interest_area: string[];
	fav_subjects: string[];
	key_problems: string;
	secondkey_problems: string;
	is_completed: boolean;
}

export interface People_who_inspire_you {
	name: string;
}

export interface Fav_book {
	name: string;
}

export interface Fav_movy {
	name: string;
}

export interface Fav_website {
	name: string;
}

export interface Know_you_better {
	fav_message_service: string[];
	people_who_inspire_you: People_who_inspire_you[];
	fav_books: Fav_book[];
	fav_movies: Fav_movy[];
	fav_websites: Fav_website[];
	fav_websites1: string;
	fav_websites2: string;
	fav_websites3: string;
	is_completed: boolean;
}

export interface Describe_any_project {
	_id: string;
	title: string;
	description: string;
	project_url: string;
}

export interface Writing_sample {
	file: any[];
	_id: string;
	description: string;
	answer: string;
}

export interface Award {
	duration: string[];
	file: any[];
	_id: string;
	title: string;
	description: string;
	role: string;
	type: string;
}

export interface Project {
	describe_any_project: Describe_any_project[];
	writing_sample: Writing_sample[];
	someone_said_something_or_recommendation: any[];
	award: Award[];
	is_completed: boolean;
}

export interface Expected_year_to_start {
	preferred_countries: any[];
	grade: string;
	year: string;
	other_degree?: any;
}

export interface Test_info {
	test_name: string;
	test_status: string;
	current_score: string;
	test_date: string;
}

export interface Institutes_Wishlist {
	_id: string;
	institute_name: string;
}

export interface Preferred_country {
	_id: string;
	item_id: number;
	item_text: string;
}

export interface Wish_to_study {
	_id: string;
	grade?: any;
	subjects: string;
	majors: string;
}

export interface Headed {
	expected_year_to_start: Expected_year_to_start;
	test_info: Test_info[];
	institutes_Wishlist: Institutes_Wishlist[];
	preferred_countries: Preferred_country[];
	wish_to_study: Wish_to_study[];
	is_completed: boolean;
}

export interface Wish_to_apply_for_scholarship {
	answer: boolean;
	imoprtance: string;
}

export interface Prefrence {
	wish_to_apply_for_scholarships: Wish_to_apply_for_scholarship;
	interested_in_gap: string;
	privacy: string;
	future_privacy: string;
	how_would_like_to_pay: string;
	family_income: string;
	is_completed: boolean;
}

export interface Phone_number {
	extension: string;
	number: string;
}

export interface Phone_number {
	extension: string;
	number: string;
}

export interface Parents_detail {
	phone_number: Phone_number;
	name: string;
	email: string;
	relation: string;
	privacy: string;
}

export interface Phone_number {
	number: string;
	extension: string;
}

export interface School_counselor {
	phone_number: Phone_number;
	name: string;
	privacy: string;
	email: string;
}

export interface Ways_to_be_in_touch {
	phone_number: Phone_number;
	parents_details: Parents_detail;
	school_counselor: School_counselor[];
	dob: string;
	age: string;
	is_completed: boolean;
}

export interface Student_profile {
	geography: Geography;
	history: History;
	history_updated: History_updated;
	interest: Interest;
	know_you_better: Know_you_better;
	projects: Project;
	headed: Headed;
	prefrences: Prefrence;
	ways_to_be_in_touch: Ways_to_be_in_touch;
	_id: string;
}

export interface Profile_statu {
	geography: boolean;
	history_updated: boolean;
	interest: boolean;
	know_you_better: boolean;
	projects: boolean;
	headed: boolean;
	prefrences: boolean;
	ways_to_be_in_touch: boolean;
}

export interface Profile_completion {
	profile_percentage: number;
	profile_text: string;
	profile_status: Profile_statu;
	profile_completed: boolean;
}

export interface User_id {
	gender: string;
	slug: string;
	active: boolean;
	password_Activation: string;
	type: string;
	user_roles: any[];
	attemptCalculation: number;
	attemptBlock: boolean;
	passwordChange: boolean;
	forgetPasswordChange: boolean;
	followcount: number;
	_id: string;
	last_name: string;
	email: string;
	password: string;
	phone_number: any[];
	studentType: string;
	createdAt: string;
	updatedAt: string;
	__v: number;
	reset_password_expires: string;
	reset_password_token: string;
	city: number;
	country: number;
	state: number;
	avatar: string;
	bannerImage: string;
	mentorFollow: any[];
	qualification: string;
	allbannerImage: AllbannerImage[];
	student_profile: Student_profile;
	name: string;
	status: number;
	profile_completion: Profile_completion;
	id: string;
}

export interface Instructor {
	_id: string;
	user_id: User_id;
	linkedin: string;
	about: string;
	experience: string;
	website: string;
	createdAt: string;
	updatedAt: string;
	__v: number;
	id: string;
}

export interface ProgramCourse {
	courseId: any;
	courseType: string;
}

export interface Program {
	_id: string;
	title?: string;
	shortDescription: string;
	description: string;
	status:string;
	coreCourseCount: number;
	electiveCourseCount: number;
	programCourse: ProgramCourse[];
	createdAt?: Date;
	updatedAt?: Date;
}