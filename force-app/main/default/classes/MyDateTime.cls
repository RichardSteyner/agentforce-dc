global class MyDateTime {
    
	@AuraEnabled
	global Datetime dateTimeValue;
	
	public MyDateTime(Datetime dateTimeValue) {
		this.dateTimeValue = dateTimeValue;
    }

	public MyDateTime() {
		
	}
}