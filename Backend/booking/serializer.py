from rest_framework import serializers
from booking.models import Booking
from availability.serializer import TimeSlotSerializer
from users.serializers.student import StudentSerializer
from users.serializers.tutor import TutorSerializer

class BookingSerializer(serializers.ModelSerializer):
    student      = StudentSerializer(read_only=True)
    tutor        = TutorSerializer(read_only=True)
    timeslot     = TimeSlotSerializer(read_only=True)
    timeslot_id  = serializers.PrimaryKeyRelatedField(
        queryset=TimeSlotSerializer.Meta.model.objects.all(),
        write_only=True,
        source='timeslot'
    )

    class Meta:
        model = Booking
        fields = [
            'id','student','tutor','timeslot','timeslot_id','status','message','created_at',
        ]
        read_only_fields = ['id', 'student', 'tutor', 'status', 'created_at', 'timeslot']

    def validate(self, data):
        """
        Validación adicional: comprueba que el TimeSlot no esté ya reservado.
        """
        timeslot = data.get('timeslot')
        tutor    = timeslot.tutor
        if Booking.objects.filter(tutor=tutor, timeslot=timeslot).exists():
            raise serializers.ValidationError("Esta franja ya está reservada.")
        return data

    def create(self, validated_data):
        """
        Al crear:
        - student se infiere de request.user.student_profile
        - tutor se infiere de timeslot.tutor
        """
        request     = self.context['request']
        student_obj = request.user.student_profile
        timeslot    = validated_data.pop('timeslot')
        tutor_obj   = timeslot.tutor

        booking = Booking.objects.create(
            student=student_obj,
            tutor=tutor_obj,
            timeslot=timeslot,
            **validated_data
        )
        return booking