<div class="wrap fbpimporter-admin">
	<div class="fbpimporter-header">
		<h2>Facebook Post Importer Options</h2>
	</div>

<?php
	if($_POST['fbpimporter_hidden'] == 'Y') {
        $fbpimorter_url = $_POST['fbpimorter_url'];
        update_option('fbpimorter_url', $fbpimorter_url);
        $fbpimorter_accesstoken = $_POST['fbpimorter_accesstoken'];
        update_option('fbpimorter_accesstoken', $fbpimorter_accesstoken);
        $successStyle = 'show';
    } else {
		$fbpimorter_url = get_option('fbpimorter_url');
		$fbpimorter_accesstoken = get_option('fbpimorter_accesstoken');
		$successStyle = 'hide';
    }
?>

    <form class="fbpimporter-form" name="fbpimporter_form" method="post" action="<?php echo str_replace( '%7E', '~', $_SERVER['REQUEST_URI']); ?>">
        <input type="hidden" name="fbpimporter_hidden" value="Y">
        <div class="fbpimporter-form-fields">
            <div class="fbpimporter-status <?= $successStyle ?>">
                <div class="fbpimporter-success <?= $successStyle ?>">
                    Options saved successfully
                </div>
	            <div class="fbpimporter-error hide">
	                Please specify valid value(s) for following field(s)
	                <div class="fbpimporter-error-msg"></div>
	            </div>
	            <div class="fbpimporter-error-close">&times</div>
	        </div>
	        <div class="fbpimporter-form-field-wrapper">
		        <div class="fbpimporter-form-field-label">
	                Facebook Post URL:
	            </div>
		        <div class="fbpimporter-form-field">
		            <input type="text" name="fbpimorter_url" value="<?php echo $fbpimorter_url; ?>" size="100">
		        </div>
	        </div>
	        <div class="fbpimporter-form-field-wrapper">
		        <div class="fbpimporter-form-field-label">
		            Facebook Access Token:
		        </div>
		        <div class="fbpimporter-form-field">
		            <input type="text" name="fbpimorter_accesstoken" value="<?php echo $fbpimorter_accesstoken; ?>" size="100">
		        </div>
	        </div>
        </div>
        <div class="form-options">
            <input class="form-options-submit" id="formSubmit" type="submit" name="Submit" value="Save" />
        </div>
    </form>
</div>