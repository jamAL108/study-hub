from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiTypes
from rest_framework import status

def upload_pdf_schema():
    return extend_schema(
        description='API to upload a PDF file. Role requires: Admin, Requestor',
        parameters=[
            OpenApiParameter(
                name="file",
                type=OpenApiTypes.BINARY,
                location=OpenApiParameter.QUERY,
                description="PDF file to be uploaded",
            )
        ],
        tags=['PDF Upload'],
        responses={
            200: {
                'type': 'object',
                'properties': {
                    'success': {'type': 'boolean'},
                    'message': {'type': 'string'},
                },
                'example': {
                    'success': True,
                    'message': 'PDF received and saved successfully',
                }
            },
            404: {
                'type': 'object',
                'properties': {
                    'success': {'type': 'boolean'},
                    'Error': {'type': 'string'},
                },
                'example': {
                    'success': False,
                    'Error': 'File error',
                }
            },
            500: {
                'type': 'object',
                'properties': {
                    'success': {'type': 'boolean'},
                    'Error': {'type': 'string'},
                },
                'example': {
                    'success': False,
                    'Error': 'Internal Server Error',
                }
            }
        }
    )
