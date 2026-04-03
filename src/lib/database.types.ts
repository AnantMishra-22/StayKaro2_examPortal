export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: 'admin' | 'member';
          member_code: string | null;
          full_name: string;
          email: string;
          phone: string | null;
          photo_url: string | null;
          status: 'active' | 'inactive' | 'pending';
          rank: number | null;
          avg_score: number;
          exams_taken: number;
          language: 'en' | 'te';
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      questions: {
        Row: {
          id: string;
          subject_id: string;
          topic_id: string | null;
          text: string;
          text_te: string | null;
          options: string[];
          options_te: string[] | null;
          correct_index: number;
          explanation: string | null;
          difficulty: 'Easy' | 'Medium' | 'Hard';
          marks: number;
          is_active: boolean;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['questions']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['questions']['Insert']>;
      };
      exams: {
        Row: {
          id: string;
          title: string;
          title_te: string | null;
          subject_id: string | null;
          total_questions: number;
          duration_minutes: number;
          difficulty_easy_pct: number;
          difficulty_med_pct: number;
          difficulty_hard_pct: number;
          shuffle_questions: boolean;
          shuffle_options: boolean;
          permission_type: 'all' | 'selected';
          pass_percentage: number;
          status: 'draft' | 'open' | 'assigned' | 'closed';
          scheduled_at: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['exams']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['exams']['Insert']>;
      };
      exam_sessions: {
        Row: {
          id: string;
          exam_id: string;
          member_id: string;
          status: 'active' | 'submitted' | 'auto_submitted' | 'expired';
          started_at: string;
          submitted_at: string | null;
          time_in: string;
          time_out: string | null;
          answers: Record<string, number>;
          score: number | null;
          total_marks: number | null;
          correct_count: number | null;
          wrong_count: number | null;
          unattempted: number | null;
          rank: number | null;
          tab_switches: number;
          violation_log: Array<{ timestamp: string; type: string }>;
          request_retry: boolean;
        };
        Insert: Omit<Database['public']['Tables']['exam_sessions']['Row'], 'id' | 'started_at' | 'time_in'>;
        Update: Partial<Database['public']['Tables']['exam_sessions']['Insert']>;
      };
      notifications: {
        Row: {
          id: string;
          title: string;
          title_te: string | null;
          message: string;
          message_te: string | null;
          recipient_type: 'all' | 'selected';
          status: 'sent' | 'scheduled' | 'failed';
          scheduled_at: string | null;
          sent_at: string;
          sent_by: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['notifications']['Row'], 'id' | 'sent_at' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['notifications']['Insert']>;
      };
      ticker_messages: {
        Row: {
          id: string;
          message: string;
          message_te: string | null;
          is_active: boolean;
          order_idx: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['ticker_messages']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['ticker_messages']['Insert']>;
      };
      exam_permissions: {
        Row: { exam_id: string; member_id: string; };
        Insert: { exam_id: string; member_id: string; };
        Update: { exam_id?: string; member_id?: string; };
      };
      member_notifications: {
        Row: { notification_id: string; member_id: string; is_read: boolean; created_at: string; };
        Insert: { notification_id: string; member_id: string; is_read?: boolean; created_at?: string; };
        Update: { notification_id?: string; member_id?: string; is_read?: boolean; created_at?: string; };
      };
      activity_feed: {
        Row: { id: string; event_type: string; member_id: string; exam_id: string | null; description: string; created_at: string; };
        Insert: { event_type: string; member_id: string; exam_id?: string | null; description: string; };
        Update: { event_type?: string; member_id?: string; exam_id?: string | null; description?: string; };
      };
    };
    Views: {
      v_leaderboard: {
        Row: {
          id: string;
          member_code: string;
          full_name: string;
          photo_url: string | null;
          avg_score: number;
          exams_taken: number;
          rank: number;
        };
      };
      v_member_results: {
        Row: {
          id: string;
          member_id: string;
          exam_id: string;
          exam_title: string;
          subject: string;
          score: number;
          correct_count: number;
          wrong_count: number;
          rank: number;
          session_status: string;
          submitted_at: string;
          result: 'pass' | 'fail';
        };
      };
      v_admin_stats: {
        Row: {
          total_members: number;
          active_members: number;
          open_exams: number;
          avg_score: number;
          pending_requests: number;
          total_questions: number;
        };
      };
    };
    Functions: {};
  };
}
