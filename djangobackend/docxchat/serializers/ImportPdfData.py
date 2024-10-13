from rest_framework import serializers

class ImportPdfDataSerializers(serializers.Serializer):
    file = serializers.FileField()
    
    class Meta:
        fields = ['file']

    # Define the maximum allowed file size in bytes (5MB here)
    MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB

    # Define allowed file extensions
    ALLOWED_FILE_EXTENSIONS = 'pdf'

    def validate_file(self, value):
        """
        Validate the uploaded file for size and extension
        """
        # Check file size
        if value.size > self.MAX_FILE_SIZE:
            raise serializers.ValidationError(f"File size exceeds the limit of {self.MAX_FILE_SIZE / (1024 * 1024)} MB.")
        
        # Check file extension
        ext = value.name.split('.')[-1].lower()  # Get the file extension
        if ext != self.ALLOWED_FILE_EXTENSIONS:
            raise serializers.ValidationError(f"Unsupported file extension '{ext}'. Allowed formats are: {', '.join(self.ALLOWED_FILE_EXTENSIONS)}.")
        
        return value
